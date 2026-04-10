/**
 * 服务器入口文件
 * 负责配置和启动Express应用程序, Socket.IO服务以及MongoDB连接
 */
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { createServer } from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';
import connectDB from './config/db';
import analyticsRoutes from './routes/analytics.routes';
import chatRoutes from './routes/chat.routes';
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';
import { APIError, logError } from './utils/errorHandler';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

// 生产环境只允许真实域名；开发环境放行 localhost
const allowedOrigins = isProd
  ? [
      'https://miiqee.com',
      'https://www.miiqee.com',
      /\.miiqee\.com$/,
      /\.pages\.dev$/,
    ]
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:4000',
    ];

// ── 限流策略 ──────────────────────────────────────────────────────────────────

/** 登录接口：每 IP 15 分钟内最多 10 次 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: '请求过于频繁，请 15 分钟后再试' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProd, // 开发环境跳过限流
});

/** 全局 API：每 IP 每分钟最多 120 次 */
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { success: false, error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProd,
});

/**
 * 初始化Express应用
 */
const createApp = (): Application => {
  const app: Application = express();

  // 信任代理（Railway / Cloudflare 场景下需要以获取真实 IP）
  app.set('trust proxy', 1);

  // ── 安全头（Helmet） ────────────────────────────────────────────────────────
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // API 服务器不需要 CSP
  }));

  // ── 全局限流 ────────────────────────────────────────────────────────────────
  app.use('/api', globalLimiter);

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // 服务端调用/curl 等无 Origin
      const allowed = allowedOrigins.some(o =>
        typeof o === 'string' ? o === origin : o.test(origin)
      );
      if (allowed) return callback(null, true);
      console.warn(`[CORS] 拒绝来源: ${origin}`);
      callback(new Error('CORS 策略不允许该来源'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ── 请求体解析 ──────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // ── MongoDB 注入防护 ────────────────────────────────────────────────────────
  // 自动去除请求 body/params/query 中的 $ 和 . 运算符
  app.use(mongoSanitize({ replaceWith: '_' }));

  // ── 日志 ────────────────────────────────────────────────────────────────────
  app.use(morgan(isProd ? 'combined' : 'dev'));

  app.use('/uploads', express.static('uploads', { maxAge: '1d' }));
  app.use('/uploads/products', express.static('uploads/products', { maxAge: '1d' }));

  // API路由（登录接口附加专项限流）
  app.use('/api/products', productRoutes);
  app.use('/api/users/login', loginLimiter);
  app.use('/api/users', userRoutes);
  app.use('/api/chats', chatRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // 一次性数据导入接口（用密钥保护）
  app.get('/api/seed', async (req: Request, res: Response) => {
    const secret = req.query.secret;
    if (secret !== process.env.SEED_SECRET) {
      return res.status(403).json({ success: false, error: '无权限' });
    }
    try {
      const Product = (await import('./models/Product')).default;
      const User = (await import('./models/User')).default;
      const { products, adminUser } = await import('./seed-data');
      await Product.deleteMany({});
      await Product.insertMany(products);
      const exists = await User.findOne({ email: adminUser.email });
      if (!exists) {
        await User.create(adminUser);
      }
      res.json({ success: true, message: `已导入 ${products.length} 个产品和管理员账号` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 健康检查路由
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'API 运行正常',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  });

  // 基本路由
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: '柏木设计 API 服务',
      version: '1.0.0'
    });
  });

  // 404 错误处理
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `找不到路径: ${req.originalUrl}`
    });
  });

  // 全局错误处理中间件
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logError(err);

    // 处理已知API错误
    if (err instanceof APIError) {
      return res.status(err.statusCode).json({
        success: false,
        error: err.message
      });
    }

    // 处理MongoDB重复键错误
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: '记录已存在'
      });
    }

    // 处理验证错误
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }

    // 处理JWT错误
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: '无效的访问令牌'
      });
    }

    // 处理JWT过期错误
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: '访问令牌已过期'
      });
    }

    // 未知服务器错误
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误'
    });
  });

  return app;
};

/**
 * 配置Socket.IO
 */
const setupSocketIO = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('用户已连接:', socket.id);

    // 加入聊天室
    socket.on('join_chat', (data) => {
      if (data?.chatId) {
        socket.join(data.chatId);
        console.log(`用户 ${socket.id} 加入聊天室 ${data.chatId}`);
      }
    });

    // 发送消息
    socket.on('send_message', (data) => {
      if (data?.chatId && data?.message) {
        socket.to(data.chatId).emit('receive_message', data);
      }
    });

    // 断开连接
    socket.on('disconnect', () => {
      console.log('用户已断开连接:', socket.id);
    });
  });

  return io;
};

/**
 * 启动服务器
 */
const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();

    // 创建应用和服务器
    const app = createApp();
    const httpServer = createServer(app);

    // 配置Socket.IO
    setupSocketIO(httpServer);

    // 启动服务器
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 服务器运行在 ${process.env.NODE_ENV || 'development'} 模式下，端口 ${PORT}`);
      console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    });

    // 优雅关闭处理
    process.on('SIGTERM', () => {
      console.log('收到 SIGTERM 信号，正在关闭服务器...');
      httpServer.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
};

// 启动服务器
startServer();

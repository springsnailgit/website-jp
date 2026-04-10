import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// 获取真实客户端 IP（兼容 Railway/Cloudflare 代理）
const getClientIp = (req: Request): string =>
  (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
  req.headers['x-real-ip'] as string ||
  req.socket.remoteAddress ||
  'unknown';

const securityLog = (event: string, detail: Record<string, unknown>) => {
  console.warn(`[SECURITY] ${new Date().toISOString()} ${event}`, JSON.stringify(detail));
};

// @desc    注册用户（已关闭公开注册，仅管理员可创建账号）
// @route   POST /api/users/register
// @access  Disabled
export const register = async (_req: Request, res: Response): Promise<void> => {
  res.status(403).json({ success: false, error: '公开注册已关闭，请联系管理员' });
};

// @desc    用户登录
// @route   POST /api/users/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const ip = getClientIp(req);

    // 基础字段校验
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ success: false, error: '请提供邮箱和密码' });
      return;
    }

    // 邮箱格式校验（防止注入）
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, error: '邮箱格式无效' });
      return;
    }

    // 查找用户（同时获取账号锁定字段）
    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
    if (!user) {
      securityLog('LOGIN_UNKNOWN_EMAIL', { email, ip });
      // 故意不区分"用户不存在"和"密码错误"，防止账号枚举
      res.status(401).json({ success: false, error: '邮箱或密码错误' });
      return;
    }

    // 检查账号是否被锁定
    if (user.isLocked) {
      const remaining = Math.ceil((user.lockUntil!.getTime() - Date.now()) / 60000);
      securityLog('LOGIN_ACCOUNT_LOCKED', { email, ip, lockUntil: user.lockUntil });
      res.status(423).json({
        success: false,
        error: `账号已被临时锁定，请 ${remaining} 分钟后再试`,
      });
      return;
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      const attemptsLeft = Math.max(0, 5 - (user.loginAttempts + 1));
      securityLog('LOGIN_FAILED', { email, ip, attemptsLeft });
      res.status(401).json({
        success: false,
        error: attemptsLeft > 0
          ? `邮箱或密码错误，还剩 ${attemptsLeft} 次尝试机会`
          : '账号已被锁定 30 分钟，请稍后重试',
      });
      return;
    }

    // 登录成功，重置计数并记录 IP
    await user.resetLoginAttempts(ip);
    securityLog('LOGIN_SUCCESS', { email, ip });

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    res.status(500).json({ success: false, error: '服务器内部错误' });
  }
};

// @desc    获取当前登录用户
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user 由 auth 中间件设置
    const user = await User.findById((req as any).user.id);

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    管理员创建用户
// @route   POST /api/users/admin
// @access  Private/Admin
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, error: '该邮箱已被注册' });
      return;
    }

    // 创建用户
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 发送包含 token 的响应
const sendTokenResponse = (user: IUser, statusCode: number, res: Response): void => {
  // 创建 token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

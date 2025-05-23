# 日式珠宝设计网站 - 柏木设计

## 项目概述

本项目是一个专业的日式珠宝设计展示网站，以"花は散り また咲く 一期一会を大切に"（花会凋零又绽放，珍惜每一次相遇）为设计理念，展现日式美学的精髓。网站采用现代化的全栈技术架构，提供完整的产品展示、用户交互和后台管理功能。

## 设计理念

- **一期一会** - 每一次相遇都是难得的缘分
- **如同花开花落** - 传递生命的珍贵与美好
- **匠心制作** - 用匠心制作每一件珠宝，传递生命的珍贵与美好

## 项目结构

```
website-zhanshi/
├── website-jp/                    # 主项目目录
│   ├── frontend/                  # 前端应用
│   │   ├── src/
│   │   │   ├── app/              # Next.js 13+ App Router
│   │   │   │   ├── page.tsx      # 首页
│   │   │   │   ├── about/        # 关于我们
│   │   │   │   ├── products/     # 产品展示
│   │   │   │   ├── services/     # 设计服务
│   │   │   │   ├── contact/      # 联系我们
│   │   │   │   ├── login/        # 用户登录
│   │   │   │   └── register/     # 用户注册
│   │   │   ├── components/       # React 组件
│   │   │   │   ├── layout/       # 布局组件
│   │   │   │   ├── products/     # 产品相关组件
│   │   │   │   ├── chat/         # 聊天组件
│   │   │   │   └── ui/           # UI 组件
│   │   │   ├── styles/           # 样式文件
│   │   │   ├── utils/            # 工具函数
│   │   │   ├── hooks/            # 自定义 Hooks
│   │   │   └── services/         # API 服务
│   │   ├── public/               # 静态资源
│   │   │   └── images/           # 图片资源
│   │   └── package.json
│   ├── backend/                   # 后端 API
│   │   ├── src/
│   │   │   ├── controllers/      # 控制器
│   │   │   ├── models/           # 数据模型
│   │   │   ├── routes/           # 路由
│   │   │   ├── middleware/       # 中间件
│   │   │   ├── utils/            # 工具函数
│   │   │   ├── config/           # 配置文件
│   │   │   └── index.ts          # 入口文件
│   │   └── package.json
│   └── admin/                     # 后台管理系统（预留）
└── uploads/                       # 产品图片存储
    ├── 耳环/
    ├── 戒指/
    ├── 手链手镯/
    ├── 项链/
    ├── 胸针/
    └── 套装/
```

## 技术栈

### 前端技术
- **Next.js 14** - React 全栈框架，支持 App Router
- **React 18** - 用户界面构建库
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Framer Motion** - 动画库（可选）

### 后端技术
- **Node.js** - JavaScript 运行环境
- **Express.js** - Web 应用框架
- **TypeScript** - 类型安全的后端开发
- **MongoDB** - NoSQL 数据库
- **Mongoose** - MongoDB 对象建模工具
- **JWT** - 身份验证
- **Multer** - 文件上传处理
- **Socket.io** - 实时通信

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks
- **PM2** - 进程管理器

## 功能特性

### ✅ 已实现功能

#### 前端功能
- **响应式设计** - 适配各种设备尺寸
- **日式美学界面** - 简洁优雅的设计风格
- **产品展示系统** - 完整的产品浏览体验
  - 分类筛选（耳环、戒指、手链手镯、项链、胸针、套装）
  - 搜索功能
  - 排序功能（最新、价格、名称、评分）
  - 分页展示
- **用户认证** - 登录/注册页面
- **多页面导航** - 首页、关于我们、产品展示、设计服务、联系我们

#### 后端功能
- **RESTful API** - 标准化的 API 接口
- **数据模型** - 产品、用户、聊天、分析数据模型
- **身份验证** - JWT 令牌认证
- **文件上传** - 图片上传处理
- **错误处理** - 统一的错误处理机制
- **日志系统** - 完整的日志记录

#### 数据库设计
- **Product 模型** - 产品信息存储
- **User 模型** - 用户信息管理
- **Chat 模型** - 聊天记录存储
- **Analytics 模型** - 访问统计数据

### 🚧 开发中功能
- **实时客服系统** - Socket.io 实现
- **后台管理系统** - 产品和用户管理
- **访客统计分析** - 详细的访问数据分析
- **支付集成** - 在线支付功能

## 快速开始

### 环境要求
- Node.js 16+
- MongoDB 4.4+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd website-zhanshi
```

2. **安装后端依赖**
```bash
cd website-jp/backend
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
# MONGODB_URI=mongodb://localhost:27017/jewelry-website
# JWT_SECRET=your-jwt-secret
# PORT=5005
```

4. **安装前端依赖**
```bash
cd ../frontend
npm install
```

5. **启动开发服务器**

启动后端服务：
```bash
cd website-jp/backend
npm run dev
# 服务运行在 http://localhost:5005
```

启动前端服务：
```bash
cd website-jp/frontend
npm run dev
# 服务运行在 http://localhost:3001
```

### 生产部署

1. **构建项目**
```bash
# 构建后端
cd website-jp/backend
npm run build

# 构建前端
cd ../frontend
npm run build
```

2. **使用 PM2 部署**
```bash
# 安装 PM2
npm install -g pm2

# 启动后端服务
cd website-jp/backend
pm2 start dist/index.js --name "jewelry-backend"

# 启动前端服务
cd ../frontend
pm2 start npm --name "jewelry-frontend" -- start

# 保存 PM2 配置
pm2 save
pm2 startup
```

3. **Nginx 配置**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 前端静态文件
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API 接口
    location /api {
        proxy_pass http://localhost:5005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## API 接口文档

### 产品相关接口
- `GET /api/products` - 获取产品列表
- `GET /api/products/:id` - 获取单个产品详情
- `POST /api/products` - 创建产品（需要认证）
- `PUT /api/products/:id` - 更新产品（需要认证）
- `DELETE /api/products/:id` - 删除产品（需要认证）

### 用户相关接口
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息（需要认证）
- `PUT /api/users/profile` - 更新用户信息（需要认证）

### 聊天相关接口
- `GET /api/chat/messages` - 获取聊天记录
- `POST /api/chat/messages` - 发送消息
- `WebSocket /socket.io` - 实时聊天连接

### 分析相关接口
- `GET /api/analytics/visitors` - 获取访客统计
- `POST /api/analytics/track` - 记录访问数据

## 项目特色

### 🎨 设计特色
- **日式极简美学** - 简洁、优雅、富有禅意
- **响应式设计** - 完美适配移动端和桌面端
- **优雅的动画效果** - 提升用户体验
- **无障碍设计** - 符合 WCAG 标准

### 🔧 技术特色
- **TypeScript 全栈** - 类型安全的开发体验
- **现代化架构** - 采用最新的技术栈
- **模块化设计** - 易于维护和扩展
- **性能优化** - 图片懒加载、代码分割等

### 📊 业务特色
- **产品分类管理** - 支持多种珠宝分类
- **智能搜索** - 快速找到心仪产品
- **用户体验优化** - 流畅的浏览体验
- **数据分析** - 详细的访问统计

## 开发规范

### 代码规范
- 使用 ESLint 和 Prettier 保证代码质量
- 遵循 TypeScript 最佳实践
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### Git 规范
- 使用语义化提交信息
- 功能开发使用 feature 分支
- 代码审查后合并到主分支

### 测试规范
- 单元测试覆盖核心业务逻辑
- 集成测试验证 API 接口
- E2E 测试保证用户流程

## 维护指南

### 日常维护
- 定期更新依赖包
- 监控服务器性能
- 备份数据库数据
- 检查安全漏洞

### 性能优化
- 图片压缩和 CDN 加速
- 数据库查询优化
- 缓存策略实施
- 代码分割和懒加载

### 安全措施
- HTTPS 加密传输
- 输入验证和清理
- SQL 注入防护
- XSS 攻击防护
- CSRF 令牌验证

## 版本历史

### v1.0.0 (2025-05-23)
- ✅ 完成基础架构搭建
- ✅ 实现产品展示系统
- ✅ 完成用户认证功能
- ✅ 实现响应式设计
- ✅ 完成 API 接口开发

### 计划中的版本
- **v1.1.0** - 实时客服系统
- **v1.2.0** - 后台管理系统
- **v1.3.0** - 支付集成
- **v2.0.0** - 移动端 App

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- **项目负责人**: [您的姓名]
- **邮箱**: [your.email@example.com]
- **网站**: [https://your-website.com]

---

*"花は散り また咲く 一期一会を大切に" - 珍惜每一次美好的相遇*

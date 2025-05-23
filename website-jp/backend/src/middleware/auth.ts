import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// 扩展 Request 接口以包括用户
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * 保护路由中间件 - 验证用户是否已登录
 *
 * 1. 从请求头或cookie中获取令牌
 * 2. 验证令牌有效性
 * 3. 加载用户信息并添加到请求对象
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头或cookie中获取令牌
    const token =
      (req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1]) ||
      req.cookies?.token;

    // 未提供令牌
    if (!token) {
      return res.status(401).json({ success: false, error: '未授权访问' });
    }

    try {
      // 验证令牌
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

      // 获取用户信息
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, error: '用户不存在' });
      }

      // 将用户附加到请求对象
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, error: '令牌无效' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 角色授权中间件 - 限制特定角色访问
 * @param {...string} roles - 允许访问的角色列表
 * @returns {Function} Express中间件函数
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 确保用户已经通过了身份验证
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '需要先进行身份验证'
      });
    }

    // 检查用户角色是否在允许列表中
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `权限不足: 角色 ${req.user.role} 无权访问`
      });
    }

    next();
  };
};

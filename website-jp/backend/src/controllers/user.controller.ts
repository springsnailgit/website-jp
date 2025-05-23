import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// @desc    注册用户
// @route   POST /api/users/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

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
    });

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    用户登录
// @route   POST /api/users/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 验证邮箱和密码是否提供
    if (!email || !password) {
      res.status(400).json({ success: false, error: '请提供邮箱和密码' });
      return;
    }

    // 检查用户是否存在
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, error: '无效的凭据' });
      return;
    }

    // 验证密码
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: '无效的凭据' });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE || '30') * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  loginAttempts: number;
  lockUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(ip?: string): Promise<void>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '请提供名称'],
    },
    email: {
      type: String,
      required: [true, '请提供电子邮件'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        '请提供有效的电子邮件',
      ],
    },
    password: {
      type: String,
      required: [true, '请提供密码'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 虚拟字段：账号是否处于锁定状态
UserSchema.virtual('isLocked').get(function (this: any) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

/**
 * 密码加密中间件 - 保存前自动哈希密码
 */
UserSchema.pre('save', async function (next) {
  // 仅在密码被修改时进行哈希处理
  if (!this.isModified('password')) {
    return next();
  }

  // 使用10轮盐值加密密码
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 匹配用户输入的密码与加密后的密码
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * 生成JWT令牌（有效期缩短为7天）
 */
UserSchema.methods.getSignedJwtToken = function () {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET 环境变量未设置，拒绝签发令牌');
  }
  return jwt.sign({ id: this._id }, jwtSecret, { expiresIn: '7d' });
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30分钟

/**
 * 登录失败：累加失败次数，超过阈值锁定账号 30 分钟
 */
UserSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < new Date()) {
    // 锁定已过期，重置计数
    await this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
    return;
  }
  const update: any = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    update.$set = { lockUntil: new Date(Date.now() + LOCK_DURATION_MS) };
  }
  await this.updateOne(update);
};

/**
 * 登录成功：重置失败计数，记录最后登录时间和 IP
 */
UserSchema.methods.resetLoginAttempts = async function (ip?: string) {
  await this.updateOne({
    $set: { loginAttempts: 0, lastLoginAt: new Date(), lastLoginIp: ip || '' },
    $unset: { lockUntil: 1 },
  });
};

export default mongoose.model<IUser>('User', UserSchema);

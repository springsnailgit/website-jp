import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
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
  },
  {
    timestamps: true,
  }
);

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
 * 生成JWT令牌
 * @returns {string} 已签名的JWT
 */
UserSchema.methods.getSignedJwtToken = function () {
  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_replace_in_production';
  if (jwtSecret === 'dev_secret_key_replace_in_production') {
    console.warn('警告: JWT_SECRET未设置，使用默认密钥。在生产环境中应设置强密钥。');
  }

  // 简化JWT签名以解决类型问题
  return jwt.sign(
    { id: this._id },
    jwtSecret,
    { expiresIn: '30d' }
  );
};

export default mongoose.model<IUser>('User', UserSchema);

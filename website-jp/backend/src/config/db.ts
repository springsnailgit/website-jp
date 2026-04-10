import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // 设置 mongoose 连接选项以提高性能和稳定性
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/japanese-ecommerce',
      {
        maxPoolSize: 10, // 连接池最大连接数
        serverSelectionTimeoutMS: 5000, // 服务器选择超时
        socketTimeoutMS: 45000, // Socket 超时
      }
    );

    console.log(`MongoDB 已连接: ${conn.connection.host}`);

    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB 连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 连接已断开');
    });

  } catch (error: any) {
    console.error(`MongoDB 连接失败: ${error.message}`);
    console.error('请检查 MONGO_URI 环境变量是否正确设置');
    // 延迟退出，让日志有时间输出
    setTimeout(() => process.exit(1), 1000);
  }
};

export default connectDB;

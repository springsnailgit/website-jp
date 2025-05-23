/**
 * 自定义错误类，方便统一处理API错误
 */
export class APIError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 错误响应助手函数
 * 统一处理API错误响应格式
 */
export const errorResponse = (message: string, statusCode = 500) => {
  return {
    success: false,
    error: message,
    status: statusCode
  };
};

/**
 * 成功响应助手函数
 * 统一处理API成功响应格式
 * @param data 响应数据
 * @param message 成功消息
 * @param statusCode HTTP状态码
 * @param meta 额外的元数据
 * @returns 格式化的响应对象
 */
export const successResponse = (data: any, message = '操作成功', statusCode = 200, meta?: Record<string, any>) => {
  return {
    success: true,
    message,
    data,
    status: statusCode,
    ...(meta && { meta })
  };
};

/**
 * 处理异步函数中的错误
 * 用于简化控制器中的try-catch模式
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 在开发环境中记录错误信息
 */
export const logError = (err: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('错误详情:', {
      message: err.message,
      stack: err.stack,
      ...err
    });
  } else {
    // 在生产环境可以使用专业日志服务
    console.error('错误:', err.message);
  }
};

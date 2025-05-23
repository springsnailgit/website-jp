/**
 * 日志工具
 * 提供统一的日志记录功能
 */
import fs from 'fs';
import path from 'path';

// 日志级别
enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

// 日志配置
const config = {
  level: process.env.LOG_LEVEL || 'INFO',
  logToFile: process.env.NODE_ENV === 'production',
  logFilePath: path.join(__dirname, '../../logs'),
}

// 确保日志目录存在
if (config.logToFile) {
  if (!fs.existsSync(config.logFilePath)) {
    fs.mkdirSync(config.logFilePath, { recursive: true });
  }
}

/**
 * 格式化日期时间
 */
const formatDateTime = () => {
  const now = new Date();
  return now.toISOString();
};

/**
 * 将日志写入文件
 */
const writeToFile = (level: LogLevel, message: string, meta?: any) => {
  if (!config.logToFile) return;

  const logEntry = `${formatDateTime()} [${level}] ${message} ${meta ? JSON.stringify(meta) : ''}\n`;
  const logFile = path.join(config.logFilePath, `${new Date().toISOString().split('T')[0]}.log`);

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('无法写入日志文件:', err);
    }
  });
};

/**
 * 创建日志条目
 */
const log = (level: LogLevel, message: string, meta?: any) => {
  const logLevels = Object.values(LogLevel);
  const configLevelIndex = logLevels.indexOf(config.level as LogLevel);
  const currentLevelIndex = logLevels.indexOf(level);

  if (currentLevelIndex <= configLevelIndex) {
    const formattedMessage = `${formatDateTime()} [${level}] ${message}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, meta || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, meta || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, meta || '');
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage, meta || '');
        break;
    }

    writeToFile(level, message, meta);
  }
};

// 导出日志函数
export default {
  error: (message: string, meta?: any) => log(LogLevel.ERROR, message, meta),
  warn: (message: string, meta?: any) => log(LogLevel.WARN, message, meta),
  info: (message: string, meta?: any) => log(LogLevel.INFO, message, meta),
  debug: (message: string, meta?: any) => log(LogLevel.DEBUG, message, meta),
};

/**
 * 应用配置
 * 集中管理环境变量和全局配置
 */

// API基础URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

// 图片占位符
export const IMAGE_PLACEHOLDER = '/images/placeholder.jpg';

// 默认图片模糊数据URL
export const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI3QlWejAAAAABJRU5ErkJggg==';

// 分页配置
export const PAGINATION = {
  defaultPageSize: 12,
  pageSizeOptions: [12, 24, 36, 48]
};

// 本地存储键
export const STORAGE_KEYS = {
  token: 'token',
  user: 'user',
  visitorId: 'visitorId',
  cart: 'cart'
};

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 10000;

// 默认语言
export const DEFAULT_LOCALE = 'zh-CN';

export default {
  API_BASE_URL,
  IMAGE_PLACEHOLDER,
  BLUR_DATA_URL,
  PAGINATION,
  STORAGE_KEYS,
  REQUEST_TIMEOUT,
  DEFAULT_LOCALE
};

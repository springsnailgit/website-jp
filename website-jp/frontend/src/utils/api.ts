'use client';

import { API_BASE_URL, REQUEST_TIMEOUT, STORAGE_KEYS } from '@/config';

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
  status?: number;
}

/**
 * 请求选项接口
 */
export interface RequestOptions extends RequestInit {
  timeout?: number;
  withAuth?: boolean;
}

/**
 * 请求超时错误
 */
class TimeoutError extends Error {
  constructor(message = '请求超时') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * API错误
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * 创建带超时的fetch请求
 * @param url 请求URL
 * @param options 请求选项
 * @returns Promise<Response>
 */
const fetchWithTimeout = async (url: string, options: RequestOptions = {}): Promise<Response> => {
  const { timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new TimeoutError();
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * 获取认证头信息
 * @returns 包含认证信息的头部对象
 */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 通用API请求函数
 * @param endpoint API端点
 * @param options 请求选项
 * @returns Promise<ApiResponse<T>>
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { withAuth = false, headers = {}, ...restOptions } = options;
  
  // 构建完整URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // 合并认证头
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
    ...(withAuth ? getAuthHeaders() : {})
  };
  
  try {
    const response = await fetchWithTimeout(url, {
      ...restOptions,
      headers: requestHeaders
    });
    
    // 解析响应JSON
    const data = await response.json();
    
    // 处理API错误
    if (!response.ok) {
      const errorMessage = data.error || data.message || '请求失败';
      throw new ApiError(errorMessage, response.status);
    }
    
    return data as ApiResponse<T>;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error.message || '网络请求失败',
      error instanceof TimeoutError ? 408 : 500
    );
  }
};

/**
 * GET请求
 */
export const get = <T = any>(endpoint: string, options?: RequestOptions) => 
  apiRequest<T>(endpoint, { method: 'GET', ...options });

/**
 * POST请求
 */
export const post = <T = any>(endpoint: string, data?: any, options?: RequestOptions) => 
  apiRequest<T>(endpoint, { 
    method: 'POST', 
    body: data ? JSON.stringify(data) : undefined,
    ...options 
  });

/**
 * PUT请求
 */
export const put = <T = any>(endpoint: string, data?: any, options?: RequestOptions) => 
  apiRequest<T>(endpoint, { 
    method: 'PUT', 
    body: data ? JSON.stringify(data) : undefined,
    ...options 
  });

/**
 * DELETE请求
 */
export const del = <T = any>(endpoint: string, options?: RequestOptions) => 
  apiRequest<T>(endpoint, { method: 'DELETE', ...options });

export default {
  get,
  post,
  put,
  del
};

'use client';

import { useEffect } from 'react';

/**
 * 生成访问者ID
 * @returns 访问者唯一标识
 */
const generateVisitorId = (): string => {
  const existingId = localStorage.getItem('visitorId');
  if (existingId) return existingId;
  
  const newId = `visitor-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem('visitorId', newId);
  return newId;
};

/**
 * 获取设备类型
 * @returns 'mobile' 或 'desktop'
 */
const getDeviceType = (): string => {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
};

/**
 * 页面访问分析Hook
 * 记录页面访问和停留时间
 */
export const useAnalytics = () => {
  useEffect(() => {
    // 记录页面访问
    const recordPageVisit = async () => {
      try {
        const visitorId = generateVisitorId();
        
        // 发送访问记录到后端
        await fetch('/api/analytics/visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitorId,
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            language: navigator.language,
            deviceType: getDeviceType()
          }),
        });
      } catch (error) {
        // 静默失败，不影响用户体验
        console.error('Error recording visit:', error);
      }
    };

    // 尝试记录访问
    recordPageVisit();

    // 设置页面访问开始时间，用于计算停留时长
    const visitStartTime = Date.now();

    return () => {
      // 页面卸载时，计算停留时长并发送
      const duration = Math.floor((Date.now() - visitStartTime) / 1000);
      const visitorId = localStorage.getItem('visitorId');
      
      if (visitorId && duration > 0) {
        const data = JSON.stringify({
          visitorId,
          page: window.location.pathname,
          duration
        });

        // 使用 navigator.sendBeacon 在页面关闭时也能发送数据
        navigator.sendBeacon('/api/analytics/duration', data);
      }
    };
  }, []);
};

export default useAnalytics;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // 指定源代码目录
  distDir: '.next',
  // 使用 src 目录
  webpack: (config, { isServer }) => {
    // 自定义 webpack 配置
    return config;
  },
};

module.exports = nextConfig;

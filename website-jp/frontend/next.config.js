/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.railway.app' },
      { protocol: 'https', hostname: '*.pages.dev' },
      // 替换成你的实际域名，例如：kashiwagi-design.com
      { protocol: 'https', hostname: '*.kashiwagi-design.com' },
    ],
  },
};

module.exports = nextConfig;

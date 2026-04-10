/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.railway.app' },
      { protocol: 'https', hostname: '*.pages.dev' },
      { protocol: 'https', hostname: '*.miiqee.com' },
      { protocol: 'https', hostname: 'pub-26122746ac38472a89d42469ee48555f.r2.dev' },
    ],
  },
};

module.exports = nextConfig;

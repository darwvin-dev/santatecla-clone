/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.santateclaliving.com' },
      { protocol: 'https', hostname: 'santateclaliving.com' },
      { protocol: 'http', hostname: '217.154.118.30' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
      allowedOrigins: ['https://example.com'],
    },
  },
};

module.exports = nextConfig;

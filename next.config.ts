/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb', 
      allowedOrigins: ['https://example.com'],
    },
  },
};

module.exports = nextConfig;

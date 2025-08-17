/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains: ['www.santateclaliving.com', 'santateclaliving.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
      allowedOrigins: ["https://example.com"],
    },
  },
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        port: '',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  trailingSlash: false,
  distDir: 'out',
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
import type { NextConfig } from "next";

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:8080';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:8080';
const CHATBOT_SERVICE_URL = process.env.CHATBOT_SERVICE_URL || 'http://127.0.0.1:3005';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/auth/:path*',
        destination: `${IDENTITY_SERVICE_URL}/api/v1/auth/:path*`,
      },
      {
        source: '/api/v1/admin/:path*',
        destination: `${IDENTITY_SERVICE_URL}/api/v1/admin/:path*`,
      },
      {
        source: '/api/v1/notifications/:path*',
        destination: `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/:path*`,
      },
      {
        source: '/api/v1/chatbot/:path*',
        destination: `${CHATBOT_SERVICE_URL}/api/v1/chatbot/:path*`,
      },
    ];
  },
};

export default nextConfig;

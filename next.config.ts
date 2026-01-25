import type { NextConfig } from "next";

// rewrites先はサーバーサイド専用の環境変数を使用
const apiRewriteDestination = process.env.API_REWRITE_DESTINATION || 'https://dm1vi7xjicrqg.cloudfront.net';
const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST || 'dm1vi7xjicrqg.cloudfront.net';

const isLocalHost = imageHost === 'localhost' || imageHost === '127.0.0.1';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: isLocalHost ? 'http' : 'https',
        hostname: imageHost,
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dm1vi7xjicrqg.cloudfront.net',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiRewriteDestination}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

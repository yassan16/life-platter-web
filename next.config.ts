import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
        destination: 'https://dm1vi7xjicrqg.cloudfront.net/api/:path*',
      },
    ];
  },
};

export default nextConfig;

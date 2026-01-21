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
};

export default nextConfig;

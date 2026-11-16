import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGitHubPages ? { basePath: '/Quran_Arabic', assetPrefix: '/Quran_Arabic/' } : {}),
};

export default nextConfig;

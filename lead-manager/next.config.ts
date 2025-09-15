import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,            // 👈 hides the bottom-left dev badge
    // buildActivityPosition: 'bottom-right', // (optional) move it instead
  },
};

export default nextConfig;

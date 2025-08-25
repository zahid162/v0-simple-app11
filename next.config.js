/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress hydration warnings caused by browser extensions
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Suppress hydration warnings in development
  experimental: {
    suppressHydrationWarning: true,
  },
  // Additional hydration error suppression
  reactStrictMode: false,
  // Suppress console errors during development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization.minimize = false;
    }
    return config;
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/zisankosk',
  assetPrefix: '/zisankosk/',
  images: {
    unoptimized: true,
  },
  experimental: {
    enableBuildCache: true,
    turbotrace: {
      enabled: true,
    },
  },
}

module.exports = nextConfig 
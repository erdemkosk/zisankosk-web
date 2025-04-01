/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
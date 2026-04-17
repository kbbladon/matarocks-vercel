// next.config.cjs
const path = require('path')
const redirects = require('./redirects.cjs')
const { withPayload } = require('@payloadcms/next/withPayload')

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@payloadcms/ui'],
  sassOptions: {
    includePaths: [
      './node_modules',
      path.join(process.cwd(), 'node_modules', '@payloadcms', 'ui', 'dist', 'scss'),
    ],
  },
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
    qualities: [100],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.cts', '.mts', '.cjs', '.mjs'],
  },
  reactStrictMode: true,
  redirects,
}

module.exports = withPayload(nextConfig)

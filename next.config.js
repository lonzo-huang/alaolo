const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n/request.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: ['*.preview.emergentagent.com', '*.emergentcf.cloud', '*.emergent.host', '478e7093-a2e9-4fdd-be42-65710e66001b.cluster-12.preview.emergentcf.cloud', '478e7093-a2e9-4fdd-be42-65710e66001b.preview.emergentagent.com'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = withNextIntl(nextConfig)

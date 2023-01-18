/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack (config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },
  reactStrictMode: false,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'pbs.twimg.com'
    ]
  }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['nxpdrunwfztdokqgcxyy.supabase.co'],
  },
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig
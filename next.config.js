/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['nxpdrunwfztdokqgcxyy.supabase.co'],
  },
  env: {
    CUSTOM_ENV: process.env.CUSTOM_ENV,
  },
}

module.exports = nextConfig
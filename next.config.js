/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['nxpdrunwfztdokqgcxyy.supabase.co'],
  },
  skipTrailingSlashRedirect: true,
  distDir: 'out',
}

module.exports = nextConfig
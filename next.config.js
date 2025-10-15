/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify Next.js Runtime gère automatiquement le static/dynamic
  images: {
    domains: ['nxpdrunwfztdokqgcxyy.supabase.co'],
    unoptimized: true
  },
  // Désactiver le strict mode pour éviter les problèmes de build
  reactStrictMode: false,
  // Pour éviter les warnings
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  trailingSlash: true,
}

module.exports = nextConfig
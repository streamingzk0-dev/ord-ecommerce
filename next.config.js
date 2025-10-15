/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify Next.js Runtime gère automatiquement le static/dynamic
  images: {
    domains: ['nxpdrunwfztdokqgcxyy.supabase.co'],
  },
  // Désactiver le strict mode pour éviter les problèmes de build
  reactStrictMode: false,
}

module.exports = nextConfig
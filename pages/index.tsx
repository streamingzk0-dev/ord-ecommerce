import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { Shop, Product } from '../types'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedContent()
  }, [])

  const fetchFeaturedContent = async () => {
    try {
      // Récupérer les boutiques actives
      const { data: shops } = await supabase
        .from('shops')
        .select('*')
        .eq('is_active', true)
        .limit(6)

      // Récupérer les produits populaires
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(8)

      setFeaturedShops(shops || [])
      setFeaturedProducts(products || [])
    } catch (error) {
      console.error('Error fetching featured content:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue sur ORD
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            La plateforme e-commerce multi-boutiques. Découvrez des produits uniques 
            provenant de boutiques indépendantes.
          </p>
          <div className="space-x-4">
            <Link
              href="/boutiques"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Découvrir les boutiques
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Créer une boutique
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Produits populaires
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  shopSlug="boutique"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Boutiques en vedette
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredShops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/boutique/${shop.slug}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    {shop.logo_url && (
                      <img
                        src={shop.logo_url}
                        alt={shop.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {shop.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {shop.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              href="/boutiques"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Voir toutes les boutiques
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
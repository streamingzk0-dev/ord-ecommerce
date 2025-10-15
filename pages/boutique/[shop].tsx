import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { Shop, Product } from '../../types'
import ProductCard from '../../components/ProductCard'

export default function ShopPage() {
  const router = useRouter()
  const { shop: shopSlug } = router.query
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (shopSlug) {
      fetchShopData()
    }
  }, [shopSlug])

  const fetchShopData = async () => {
    try {
      // Récupérer les informations de la boutique
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('slug', shopSlug)
        .eq('is_active', true)
        .single()

      if (!shopData) {
        router.push('/404')
        return
      }

      setShop(shopData)

      // Récupérer les produits de la boutique
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      setProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching shop data:', error)
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!shop) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Boutique non trouvée
          </h1>
          <p className="text-gray-600">
            La boutique que vous recherchez n'existe pas ou a été supprimée.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${shop.name} - ORD`}>
      {/* Bannière de la boutique */}
      {shop.banner_url && (
        <div className="h-64 bg-gray-200">
          <img
            src={shop.banner_url}
            alt={`Bannière de ${shop.name}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* En-tête de la boutique */}
        <div className="flex items-center mb-8">
          {shop.logo_url && (
            <img
              src={shop.logo_url}
              alt={`Logo de ${shop.name}`}
              className="w-20 h-20 rounded-full object-cover mr-6"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {shop.name}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              {shop.description}
            </p>
          </div>
        </div>

        {/* Produits */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Produits ({products.length})
          </h2>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Cette boutique n'a pas encore de produits.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  shopSlug={shop.slug}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../../components/Layout'
import { supabase } from '../../../../lib/supabase'
import { Product, Shop } from '../../../../types'
import { useUser } from '../../../../lib/useUser'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const router = useRouter()
  const { shop: shopSlug, productId } = router.query
  const { user } = useUser()
  const [product, setProduct] = useState<Product | null>(null)
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (shopSlug && productId) {
      fetchProductData()
    }
  }, [shopSlug, productId])

  const fetchProductData = async () => {
    try {
      // Récupérer la boutique
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

      // Récupérer le produit
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('shop_id', shopData.id)
        .eq('is_active', true)
        .single()

      if (!productData) {
        router.push('/404')
        return
      }

      setProduct(productData)
    } catch (error) {
      console.error('Error fetching product data:', error)
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour acheter')
      router.push('/auth/login')
      return
    }

    if (!product) return

    setProcessing(true)

    try {
      // Simuler un paiement (à remplacer par l'intégration réelle)
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            customer_id: user.id,
            shop_id: product.shop_id,
            product_id: product.id,
            quantity: 1,
            total_amount: product.price,
            status: 'paid'
          }
        ])

      if (error) throw error

      // Mettre à jour le stock
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: product.stock - 1 })
        .eq('id', product.id)

      if (stockError) throw stockError

      toast.success('Achat réussi!')
      router.push('/orders/success')
    } catch (error: any) {
      toast.error('Erreur lors de l\'achat: ' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!product || !shop) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Produit non trouvé
          </h1>
          <p className="text-gray-600">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`${product.name} - ${shop.name} - ORD`}>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <a href="/" className="text-gray-400 hover:text-gray-500">
                Accueil
              </a>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <a href="/boutiques" className="text-gray-400 hover:text-gray-500">
                Boutiques
              </a>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <a href={`/boutique/${shop.slug}`} className="text-gray-400 hover:text-gray-500">
                {shop.name}
              </a>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image du produit */}
          <div>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">Aucune image</span>
              </div>
            )}
          </div>

          {/* Informations du produit */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-indigo-600">
                {product.price} €
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'Aucune description disponible.'}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </span>
            </div>

            <div className="pt-6">
              {product.stock > 0 ? (
                <button
                  onClick={handlePurchase}
                  disabled={processing}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Traitement...' : `Acheter pour ${product.price} €`}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                >
                  Produit en rupture de stock
                </button>
              )}
            </div>

            {/* Informations boutique */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                À propos de la boutique
              </h3>
              <div className="flex items-center space-x-3">
                {shop.logo_url && (
                  <img
                    src={shop.logo_url}
                    alt={shop.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{shop.name}</p>
                  <p className="text-sm text-gray-500">
                    {shop.description || 'Boutique sur ORD'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
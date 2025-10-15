import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/useUser'
import { Product, Shop } from '../../../types'
import toast from 'react-hot-toast'

export default function ProductsList() {
  const { user } = useUser()
  const [products, setProducts] = useState<Product[]>([])
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Récupérer la boutique
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user?.id)
        .single()

      if (shopData) {
        setShop(shopData)

        // Récupérer les produits
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id)
          .order('created_at', { ascending: false })

        setProducts(productsData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      toast.success('Produit supprimé avec succès')
      fetchData()
    } catch (error: any) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const toggleProductStatus = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id)

      if (error) throw error

      toast.success(`Produit ${!product.is_active ? 'activé' : 'désactivé'}`)
      fetchData()
    } catch (error: any) {
      toast.error('Erreur lors de la modification')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Aucune boutique trouvée
            </h1>
            <p className="text-gray-600 mb-8">
              Vous devez créer une boutique pour gérer des produits.
            </p>
            <Link
              href="/vendor/create-shop"
              className="btn-primary"
            >
              Créer une boutique
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Mes produits - ORD">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mes produits
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les produits de votre boutique "{shop.name}"
            </p>
          </div>
          <Link
            href="/vendor/products/new"
            className="btn-primary"
          >
            Ajouter un produit
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Aucun produit pour le moment
            </p>
            <Link
              href="/vendor/products/new"
              className="btn-primary"
            >
              Ajouter votre premier produit
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id}>
                  <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-16 w-16 object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            product.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{product.price} €</span>
                          <span className="mx-2">•</span>
                          <span>Stock: {product.stock}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleProductStatus(product)}
                        className={`px-3 py-1 text-xs rounded ${
                          product.is_active
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {product.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                      <Link
                        href={`/vendor/products/edit/${product.id}`}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  )
}
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../lib/useUser'
import { Shop, Product, Order } from '../../types'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function VendorDashboard() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userLoading && (!user || user.user_metadata?.user_type !== 'vendor')) {
      router.push('/')
      return
    }

    if (user) {
      fetchVendorData()
    }
  }, [user, userLoading])

  const fetchVendorData = async () => {
    try {
      // Récupérer la boutique du vendeur
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user?.id)
        .single()

      if (shopData) {
        setShop(shopData)

        // Récupérer les produits de la boutique
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id)
          .order('created_at', { ascending: false })

        // Récupérer les commandes
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('shop_id', shopData.id)
          .order('created_at', { ascending: false })

        setProducts(productsData || [])
        setOrders(ordersData || [])
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error)
      toast.error('Erreur lors du chargement des données')
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
      fetchVendorData()
    } catch (error: any) {
      toast.error('Erreur lors de la suppression')
    }
  }

  if (userLoading || loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenue sur votre tableau de bord
            </h1>
            <p className="text-gray-600 mb-8">
              Créez votre boutique pour commencer à vendre sur ORD
            </p>
            <Link
              href="/vendor/create-shop"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Créer ma boutique
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Tableau de bord vendeur - ORD">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord - {shop.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos produits, commandes et paramètres
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Produits
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {products.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Commandes
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {orders.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ventes totales
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {orders.reduce((total, order) => total + order.total_amount, 0)} €
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Produits */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Mes produits
                </h2>
                <Link
                  href="/vendor/products/new"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Ajouter un produit
                </Link>
              </div>
            </div>
            <div className="p-6">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucun produit pour le moment
                </p>
              ) : (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {product.name}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {product.price} € • Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/vendor/products/edit/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {products.length > 5 && (
                <div className="mt-4 text-center">
                  <Link
                    href="/vendor/products"
                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    Voir tous les produits
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Commandes récentes */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Commandes récentes
              </h2>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucune commande pour le moment
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            Commande #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'paid' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'paid' ? 'Payé' : 
                           order.status === 'pending' ? 'En attente' : 'Échoué'}
                        </span>
                      </div>
                      <p className="text-gray-900 mt-2">
                        {order.total_amount} €
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Liens rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/vendor/products"
            className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Gérer les produits</h3>
          </Link>
          <Link
            href="/vendor/orders"
            className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Voir les commandes</h3>
          </Link>
          <Link
            href="/vendor/settings"
            className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Paramètres boutique</h3>
          </Link>
          <Link
            href={`/boutique/${shop.slug}`}
            className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900">Voir ma boutique</h3>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
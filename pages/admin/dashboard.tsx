import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../lib/useUser'
import { Shop, Product, Order } from '../../types'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user } = useUser()
  const [shops, setShops] = useState<Shop[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.user_metadata?.user_type === 'admin') {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Récupérer toutes les données
      const [shopsResponse, productsResponse, ordersResponse] = await Promise.all([
        supabase.from('shops').select('*'),
        supabase.from('products').select('*'),
        supabase.from('orders').select('*')
      ])

      setShops(shopsResponse.data || [])
      setProducts(productsResponse.data || [])
      setOrders(ordersResponse.data || [])

      // Calculer les statistiques
      const totalRevenue = ordersResponse.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0

      setStats({
        totalShops: shopsResponse.data?.length || 0,
        totalProducts: productsResponse.data?.length || 0,
        totalOrders: ordersResponse.data?.length || 0,
        totalRevenue
      })
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const toggleShopStatus = async (shop: Shop) => {
    try {
      const { error } = await supabase
        .from('shops')
        .update({ is_active: !shop.is_active })
        .eq('id', shop.id)

      if (error) throw error

      toast.success(`Boutique ${!shop.is_active ? 'activée' : 'désactivée'}`)
      fetchData()
    } catch (error: any) {
      toast.error('Erreur lors de la modification')
    }
  }

  if (!user || user.user_metadata?.user_type !== 'admin') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <p>Accès non autorisé.</p>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Admin Dashboard - ORD">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tableau de bord Administrateur
        </h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Boutiques
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {stats.totalShops}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Produits
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {stats.totalProducts}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Commandes
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {stats.totalOrders}
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Revenu total
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {stats.totalRevenue} €
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Liste des boutiques */}
          <div className="card">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Gestion des boutiques
              </h2>
            </div>
            <div className="p-6">
              {shops.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucune boutique
                </p>
              ) : (
                <div className="space-y-4">
                  {shops.map((shop) => (
                    <div key={shop.id} className="flex justify-between items-center border-b pb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {shop.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {shop.slug} • {shop.currency}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Créée le {new Date(shop.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          shop.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {shop.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => toggleShopStatus(shop)}
                          className={`px-3 py-1 text-xs rounded ${
                            shop.is_active
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {shop.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Commandes récentes */}
          <div className="card">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Commandes récentes
              </h2>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucune commande
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
      </div>
    </Layout>
  )
}
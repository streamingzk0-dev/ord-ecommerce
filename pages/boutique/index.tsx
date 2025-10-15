import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { Shop } from '../../types'

export default function BoutiquesList() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      const { data } = await supabase
        .from('shops')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      setShops(data || [])
    } catch (error) {
      console.error('Error fetching shops:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Découvrir les boutiques - ORD">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez nos boutiques
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez une sélection de boutiques indépendantes et découvrez des produits uniques
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Rechercher une boutique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Liste des boutiques */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Aucune boutique ne correspond à votre recherche' : 'Aucune boutique disponible'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop) => (
              <Link
                key={shop.id}
                href={`/boutique/${shop.slug}`}
                className="card p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {shop.logo_url ? (
                    <img
                      src={shop.logo_url}
                      alt={shop.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-600 font-bold text-lg">
                        {shop.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {shop.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {shop.currency}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {shop.description || 'Aucune description'}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Visiter la boutique</span>
                  <span className="text-indigo-600">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
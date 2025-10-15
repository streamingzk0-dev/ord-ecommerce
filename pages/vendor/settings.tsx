import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../lib/useUser'
import { Shop, VendorPaymentSettings } from '../../types'
import toast from 'react-hot-toast'
import { encrypt } from '../../utils/encryption'

export default function VendorSettings() {
  const { user } = useUser()
  const [shop, setShop] = useState<Shop | null>(null)
  const [paymentSettings, setPaymentSettings] = useState<VendorPaymentSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'EUR'
  })
  const [paymentForm, setPaymentForm] = useState({
    provider: 'stripe' as 'stripe' | 'fedapay' | 'paypal' | 'moneyfusion' | 'solestepay',
    apiKey: ''
  })

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user?.id)
        .single()

      if (shopData) {
        setShop(shopData)
        setFormData({
          name: shopData.name,
          description: shopData.description || '',
          currency: shopData.currency
        })

        // Récupérer les paramètres de paiement
        const { data: paymentData } = await supabase
          .from('vendor_payment_settings')
          .select('*')
          .eq('shop_id', shopData.id)

        setPaymentSettings(paymentData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShopUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shop) return

    setSaving(true)

    try {
      const { error } = await supabase
        .from('shops')
        .update({
          name: formData.name,
          description: formData.description,
          currency: formData.currency
        })
        .eq('id', shop.id)

      if (error) throw error

      toast.success('Boutique mise à jour avec succès!')
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shop) return

    setSaving(true)

    try {
      const encryptedApiKey = encrypt(paymentForm.apiKey)

      const { error } = await supabase
        .from('vendor_payment_settings')
        .upsert({
          shop_id: shop.id,
          payment_provider: paymentForm.provider,
          api_key: encryptedApiKey,
          is_active: true
        })

      if (error) throw error

      toast.success('Paramètres de paiement sauvegardés!')
      setPaymentForm({ provider: 'stripe', apiKey: '' })
      fetchData()
    } catch (error: any) {
      toast.error('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!shop) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <p>Boutique non trouvée.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Paramètres - ORD">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Paramètres de la boutique
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations boutique */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informations de la boutique
            </h2>
            <form onSubmit={handleShopUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Devise
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="input-field mt-1"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar US ($)</option>
                  <option value="XOF">Franc CFA (FCFA)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Mettre à jour'}
              </button>
            </form>
          </div>

          {/* Paramètres de paiement */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Paramètres de paiement
            </h2>

            {/* Form pour ajouter un provider */}
            <form onSubmit={handlePaymentSettings} className="space-y-4 mb-6">
              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                  Provider de paiement
                </label>
                <select
                  id="provider"
                  name="provider"
                  value={paymentForm.provider}
                  onChange={handlePaymentChange}
                  className="input-field mt-1"
                >
                  <option value="stripe">Stripe</option>
                  <option value="fedapay">FedaPay</option>
                  <option value="paypal">PayPal</option>
                  <option value="moneyfusion">MoneyFusion</option>
                  <option value="solestepay">SoleStepay</option>
                </select>
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                  Clé API
                </label>
                <input
                  type="password"
                  id="apiKey"
                  name="apiKey"
                  value={paymentForm.apiKey}
                  onChange={handlePaymentChange}
                  className="input-field mt-1"
                  placeholder="sk_test_..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
              </button>
            </form>

            {/* Liste des providers configurés */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Providers configurés
              </h3>
              {paymentSettings.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Aucun provider de paiement configuré
                </p>
              ) : (
                <div className="space-y-2">
                  {paymentSettings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium capitalize">
                          {setting.payment_provider}
                        </span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          setting.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {setting.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          const { error } = await supabase
                            .from('vendor_payment_settings')
                            .update({ is_active: !setting.is_active })
                            .eq('id', setting.id)

                          if (!error) {
                            toast.success('Statut mis à jour')
                            fetchData()
                          }
                        }}
                        className={`px-2 py-1 text-xs rounded ${
                          setting.is_active
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {setting.is_active ? 'Désactiver' : 'Activer'}
                      </button>
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
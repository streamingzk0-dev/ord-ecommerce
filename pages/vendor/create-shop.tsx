import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { useUser } from '../../lib/useUser'
import toast from 'react-hot-toast'

export default function CreateShop() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    currency: 'EUR'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      // Vérifier si le slug est disponible
      const { data: existingShop } = await supabase
        .from('shops')
        .select('id')
        .eq('slug', formData.slug)
        .single()

      if (existingShop) {
        toast.error('Ce nom de boutique est déjà utilisé')
        return
      }

      // Créer la boutique
      const { data: shop, error } = await supabase
        .from('shops')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            slug: formData.slug,
            currency: formData.currency,
            owner_id: user.id
          }
        ])
        .select()
        .single()

      if (error) throw error

      toast.success('Boutique créée avec succès!')
      router.push('/vendor/dashboard')
    } catch (error: any) {
      toast.error('Erreur lors de la création: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <p>Veuillez vous connecter pour créer une boutique.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Créer une boutique - ORD">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Créer votre boutique
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom de la boutique *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Ma Super Boutique"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              URL de la boutique *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                ord.com/boutique/
              </span>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="ma-boutique"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Cette URL sera utilisée pour accéder à votre boutique
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Décrivez votre boutique..."
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer la boutique'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
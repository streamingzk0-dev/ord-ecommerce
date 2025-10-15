import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import { supabase } from '../../../lib/supabase'
import { useUser } from '../../../lib/useUser'
import { Shop } from '../../../types'
import toast from 'react-hot-toast'

export default function NewProduct() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [shop, setShop] = useState<Shop | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null as File | null
  })
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (user) {
      fetchShop()
    }
  }, [user])

  const fetchShop = async () => {
    try {
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user?.id)
        .single()

      setShop(shopData)
    } catch (error) {
      console.error('Error fetching shop:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      
      // Créer un preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !shop) return

    setLoading(true)

    try {
      let imageUrl = ''

      // Upload de l'image si elle existe
      if (formData.image) {
        setUploading(true)
        imageUrl = await uploadImage(formData.image)
        setUploading(false)
      }

      // Créer le produit
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            image_url: imageUrl,
            shop_id: shop.id
          }
        ])

      if (error) throw error

      toast.success('Produit créé avec succès!')
      router.push('/vendor/dashboard')
    } catch (error: any) {
      toast.error('Erreur lors de la création: ' + error.message)
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!shop) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <p>Vous devez créer une boutique avant d'ajouter des produits.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Nouveau produit - ORD">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Ajouter un nouveau produit
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom du produit *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Nom du produit"
            />
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
              placeholder="Description du produit..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Prix *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="input-field mt-1"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image du produit
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="input-field mt-1"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded"
                />
              </div>
            )}
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
              disabled={loading || uploading}
              className="btn-primary disabled:opacity-50"
            >
              {uploading ? 'Upload...' : loading ? 'Création...' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
import React from 'react'
import Link from 'next/link'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
  shopSlug: string
}

export default function ProductCard({ product, shopSlug }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Aucune image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-indigo-600">
            {product.price} €
          </span>
          <Link
            href={`/boutique/${shopSlug}/produit/${product.id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Voir le produit
          </Link>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-orange-500 text-sm mt-2">
            Plus que {product.stock} en stock
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-red-500 text-sm mt-2">Rupture de stock</p>
        )}
      </div>
    </div>
  )
}
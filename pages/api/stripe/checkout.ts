import { NextApiRequest, NextApiResponse } from 'next'
import { createStripeCheckoutSession } from '../../../lib/stripe'
import { supabase } from '../../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { productId, successUrl, cancelUrl } = req.body

    // Récupérer le produit
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Vérifier le stock
    if (product.stock < 1) {
      return res.status(400).json({ error: 'Product out of stock' })
    }

    // Créer la session Stripe
    const session = await createStripeCheckoutSession(
      product,
      successUrl,
      cancelUrl
    )

    res.status(200).json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    res.status(500).json({ error: error.message })
  }
}
const handlePurchase = async () => {
  if (!user) {
    toast.error('Veuillez vous connecter pour acheter')
    router.push('/auth/login')
    return
  }

  if (!product) return

  setProcessing(true)

  try {
    // Simulation d'achat sans Stripe
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

    toast.success('Achat simulé réussi! Cette fonctionnalité utilise une simulation pour le moment.')
    router.push('/')
  } catch (error: any) {
    toast.error('Erreur lors de l\'achat: ' + error.message)
  } finally {
    setProcessing(false)
  }
}
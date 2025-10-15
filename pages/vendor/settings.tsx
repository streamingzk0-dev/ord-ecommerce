// Dans la fonction handlePaymentSettings, remplacer par:
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
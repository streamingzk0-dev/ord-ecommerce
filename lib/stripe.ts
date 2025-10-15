// Simulation de paiement côté client pour Netlify
export const simulatePayment = async (product: any, customerId: string) => {
  // Simulation d'un paiement réussi
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
        message: 'Paiement simulé avec succès'
      });
    }, 2000);
  });
};

// Pour Stripe en production (à configurer plus tard)
export const createStripeCheckoutSession = async (product: any) => {
  // Placeholder pour l'intégration Stripe future
  console.log('Stripe integration would be here for product:', product.id);
  return null;
};
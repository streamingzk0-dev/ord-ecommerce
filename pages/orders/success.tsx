import Link from 'next/link'
import Layout from '../../components/Layout'

export default function OrderSuccess() {
  return (
    <Layout title="Commande réussie - ORD">
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Commande réussie !
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              href="/"
              className="btn-primary inline-block"
            >
              Retour à l'accueil
            </Link>
            <br />
            <Link
              href="/boutiques"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Continuer vos achats →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
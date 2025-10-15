import Link from 'next/link'
import Layout from '../components/Layout'

export default function NotFound() {
  return (
    <Layout title="Page non trouvée - ORD">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-9xl font-bold text-indigo-600">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Page non trouvée
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Désolé, nous n'avons pas trouvé la page que vous recherchez.
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
              Découvrir les boutiques →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
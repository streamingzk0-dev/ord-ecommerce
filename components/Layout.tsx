import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '../lib/useUser'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title = 'ORD - Multi-boutiques' }: LayoutProps) {
  const { user, loading, signOut } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Plateforme e-commerce multi-boutiques" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 text-2xl font-bold text-indigo-600">
                ORD
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link href="/boutiques" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Découvrir les boutiques
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {loading ? (
                <div>Chargement...</div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  {user.user_metadata?.user_type === 'vendor' && (
                    <Link href="/vendor/dashboard" className="text-gray-700 hover:text-indigo-600">
                      Tableau de bord
                    </Link>
                  )}
                  {user.user_metadata?.user_type === 'admin' && (
                    <Link href="/admin/dashboard" className="text-gray-700 hover:text-indigo-600">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Connexion
                  </Link>
                  <Link href="/auth/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <p className="text-center text-gray-500">
            &copy; 2024 ORD - Plateforme e-commerce multi-boutiques
          </p>
        </div>
      </footer>
    </div>
  )
}
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'customer' | 'vendor'>('customer')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Créer le profil utilisateur dans la table users
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              user_type: userType
            }
          ])

        if (profileError) throw profileError

        toast.success('Compte créé avec succès! Veuillez vérifier votre email.')
        router.push('/auth/login')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Créer un compte - ORD">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Créer votre compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Rejoignez ORD en tant que client ou vendeur
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Votre mot de passe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de compte
              </label>
              <div className="mt-2 space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="userType"
                    value="customer"
                    checked={userType === 'customer'}
                    onChange={(e) => setUserType(e.target.value as 'customer')}
                  />
                  <span className="ml-2">Client</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    className="form-radio"
                    name="userType"
                    value="vendor"
                    checked={userType === 'vendor'}
                    onChange={(e) => setUserType(e.target.value as 'vendor')}
                  />
                  <span className="ml-2">Vendeur</span>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </div>

            <div className="text-center">
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
                Déjà un compte ? Se connecter
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
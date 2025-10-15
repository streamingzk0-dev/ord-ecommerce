import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  )
}
import { createClient } from '@supabase/supabase-js'

// Ces variables seront disponibles côté client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nxpdrunwfztdokqgcxyy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cGRydW53Znp0ZG9rcWdjeHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0Njc0MjYsImV4cCI6MjA3NjA0MzQyNn0.7BW2Fj9tLjRtQ218uQeONIj_oA8omO-UQ-uUlr7hqn4'

// Créer le client Supabase uniquement côté client
let supabase: any = null

if (typeof window !== 'undefined') {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

export { supabase }
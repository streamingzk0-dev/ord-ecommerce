import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nxpdrunwfztdokqgcxyy.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cGRydW53Znp0ZG9rcWdjeHl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ2NzQyNiwiZXhwIjoyMDc2MDQzNDI2fQ.SVOe60SQWikwv_ajoLZdl2zBl76GW-DMc-7DfBxq8mc'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_KEY, SUPABASE_URL } from './env'

/** Cliente do Supabase para componentes que rodam no navegador ('use client'). */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
}

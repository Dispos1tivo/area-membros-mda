import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_KEY, SUPABASE_URL } from './env'

/** Cliente do Supabase para páginas, server actions e rotas (roda no servidor). */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Chamado de um Server Component (não pode gravar cookie).
          // Sem problema: o middleware já renova a sessão a cada requisição.
        }
      },
    },
  })
}

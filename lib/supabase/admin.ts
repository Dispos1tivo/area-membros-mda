import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from './env'

/**
 * Cliente do Supabase com a chave SECRETA: ignora a segurança por aluno (RLS).
 * Use SOMENTE em código de servidor que não age em nome de um aluno (webhooks).
 * A chave fica só na Vercel (SUPABASE_SECRET_KEY) — nunca no navegador nem no GitHub.
 */
export function createAdminClient() {
  const chave = process.env.SUPABASE_SECRET_KEY
  if (!chave) throw new Error('Falta a variável SUPABASE_SECRET_KEY no servidor.')

  return createClient(SUPABASE_URL, chave, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

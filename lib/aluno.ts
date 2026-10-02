import { redirect } from 'next/navigation'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type Aluno = {
  id: string
  email: string
  nome: string | null
}

/**
 * Aluno logado + perfil. Redireciona para /login se não houver sessão.
 * Com cache(): layout e página compartilham a mesma consulta na requisição.
 */
export const getAluno = cache(async (): Promise<Aluno> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims) redirect('/login')

  const { data: perfil } = await supabase.from('perfis').select('nome').eq('id', claims.sub).maybeSingle()

  return { id: claims.sub, email: (claims.email as string | undefined) ?? '', nome: perfil?.nome ?? null }
})

export function primeiroNome(aluno: Aluno) {
  return aluno.nome?.trim().split(/\s+/)[0] || null
}

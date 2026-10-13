import { redirect } from 'next/navigation'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type Aluno = {
  id: string
  email: string
  nome: string | null
  /** Já criou uma senha (marcado em Minha conta). Sem senha, o aluno entra pelo código por e-mail. */
  temSenha: boolean
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

  const metadados = claims.user_metadata as { senha_definida?: boolean } | undefined

  return {
    id: claims.sub,
    email: (claims.email as string | undefined) ?? '',
    nome: perfil?.nome ?? null,
    temSenha: metadados?.senha_definida === true,
  }
})

export function primeiroNome(aluno: Aluno) {
  return aluno.nome?.trim().split(/\s+/)[0] || null
}

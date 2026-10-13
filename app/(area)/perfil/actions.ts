'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function salvarNome(formData: FormData) {
  const nome = String(formData.get('nome') ?? '')
    .trim()
    .slice(0, 80)

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')

  const { error } = await supabase
    .from('perfis')
    .update({ nome: nome || null })
    .eq('id', data.claims.sub)

  revalidatePath('/', 'layout')
  redirect(error ? '/perfil?status=erro' : '/perfil?status=salvo')
}

const SENHA_MIN = 8
const SENHA_MAX = 72

/** Cria ou troca a senha do aluno logado. Com senha, ele entra sem depender do e-mail. */
export async function salvarSenha(formData: FormData) {
  const senha = String(formData.get('senha') ?? '')
  const confirmacao = String(formData.get('confirmacao') ?? '')

  if (senha.length < SENHA_MIN || senha.length > SENHA_MAX) redirect('/perfil?senha=tamanho')
  if (senha !== confirmacao) redirect('/perfil?senha=diferente')

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')

  const { error } = await supabase.auth.updateUser({ password: senha, data: { senha_definida: true } })
  if (error) {
    const motivo =
      error.code === 'same_password' ? 'igual' : error.code === 'weak_password' ? 'fraca' : error.code === 'reauthentication_needed' ? 'reentrar' : 'erro'
    redirect(`/perfil?senha=${motivo}`)
  }

  // Novo token já com "senha_definida", para o lembrete do painel sumir na hora.
  await supabase.auth.refreshSession()

  revalidatePath('/', 'layout')
  redirect('/perfil?senha=salva')
}

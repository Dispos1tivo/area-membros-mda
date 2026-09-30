'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function salvarNome(formData: FormData) {
  const nome = String(formData.get('nome') ?? '')
    .trim()
    .slice(0, 80)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('perfis')
    .update({ nome: nome || null })
    .eq('id', user.id)

  revalidatePath('/', 'layout')
  redirect(error ? '/perfil?status=erro' : '/perfil?status=salvo')
}

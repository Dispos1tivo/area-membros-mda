import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Abre um material (PDF) do aluno.
 * A segurança do banco só encontra o material se o aluno tiver acesso ao produto;
 * aí geramos um link temporário (5 min) do arquivo privado e redirecionamos.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) return NextResponse.redirect(new URL('/login', request.url))

  const { data: material } = await supabase.from('materiais').select('arquivo').eq('id', id).maybeSingle()
  if (!material) {
    return new NextResponse('Material não encontrado ou sem acesso.', { status: 404 })
  }

  // Junto com o link, registra a abertura ("continuar de onde parou" e "já aberto").
  // Se o registro falhar, o aluno abre o material do mesmo jeito.
  const [{ data: link, error }] = await Promise.all([
    supabase.storage.from('materiais').createSignedUrl(material.arquivo, 60 * 5),
    supabase.from('materiais_abertos').upsert({ aluno_id: data.claims.sub, material_id: id, aberto_em: new Date().toISOString() }),
  ])
  if (error || !link) {
    return new NextResponse('Não foi possível abrir o material agora. Tente novamente em instantes.', { status: 500 })
  }

  return NextResponse.redirect(link.signedUrl)
}

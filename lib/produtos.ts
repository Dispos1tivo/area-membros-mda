import { createClient } from '@/lib/supabase/server'

export type Produto = {
  id: string
  slug: string
  nome: string
  etiqueta: string | null
  descricao: string | null
  checkout_url: string | null
}

export type ProdutoDoAluno = Produto & { liberado: boolean }

export type Material = {
  id: string
  secao: string
  titulo: string
  descricao: string | null
}

const CAMPOS_PRODUTO = 'id, slug, nome, etiqueta, descricao, checkout_url'

/** Todos os produtos ativos, marcando quais o aluno já tem. Liberados vêm primeiro. */
export async function getProdutosDoAluno(alunoId: string): Promise<ProdutoDoAluno[]> {
  const supabase = await createClient()

  const [{ data: produtos }, { data: acessos }] = await Promise.all([
    supabase.from('produtos').select(CAMPOS_PRODUTO).order('ordem').returns<Produto[]>(),
    supabase.from('acessos').select('produto_id').eq('aluno_id', alunoId).is('revogado_em', null),
  ])

  const liberados = new Set((acessos ?? []).map((a) => a.produto_id as string))

  return (produtos ?? [])
    .map((p) => ({ ...p, liberado: liberados.has(p.id) }))
    .sort((a, b) => Number(b.liberado) - Number(a.liberado))
}

/** Um produto pelo slug + se o aluno tem acesso a ele. */
export async function getProdutoDoAluno(slug: string, alunoId: string): Promise<ProdutoDoAluno | null> {
  const supabase = await createClient()

  const { data: produto } = await supabase
    .from('produtos')
    .select(CAMPOS_PRODUTO)
    .eq('slug', slug)
    .maybeSingle<Produto>()

  if (!produto) return null

  const { data: acesso } = await supabase
    .from('acessos')
    .select('produto_id')
    .eq('aluno_id', alunoId)
    .eq('produto_id', produto.id)
    .is('revogado_em', null)
    .maybeSingle()

  return { ...produto, liberado: !!acesso }
}

/** Materiais do produto agrupados por seção (a segurança do banco só devolve se o aluno tiver acesso). */
export async function getMateriaisPorSecao(produtoId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('materiais')
    .select('id, secao, titulo, descricao')
    .eq('produto_id', produtoId)
    .order('ordem')
    .returns<Material[]>()

  const secoes = new Map<string, Material[]>()
  for (const m of data ?? []) {
    if (!secoes.has(m.secao)) secoes.set(m.secao, [])
    secoes.get(m.secao)!.push(m)
  }
  return [...secoes.entries()].map(([secao, itens]) => ({ secao, itens }))
}

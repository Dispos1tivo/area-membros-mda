import { cache } from 'react'
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

export type ProdutoComMateriais = ProdutoDoAluno & { secoes: { secao: string; itens: Material[] }[] }

type LinhaProduto = Produto & { acessos: { revogado_em: string | null }[]; materiais: Material[] }

/**
 * Um produto pelo slug + se o aluno tem acesso + materiais agrupados por seção, em uma consulta só.
 * A segurança do banco só devolve os acessos do próprio aluno e os materiais dos produtos liberados.
 * Com cache(): o título da aba e a página compartilham a mesma consulta na requisição.
 */
export const getProdutoComMateriais = cache(async (slug: string): Promise<ProdutoComMateriais | null> => {
  const supabase = await createClient()

  const { data } = await supabase
    .from('produtos')
    .select(`${CAMPOS_PRODUTO}, acessos(revogado_em), materiais(id, secao, titulo, descricao)`)
    .eq('slug', slug)
    .order('ordem', { referencedTable: 'materiais' })
    .maybeSingle<LinhaProduto>()

  if (!data) return null

  const { acessos, materiais, ...produto } = data

  const secoes = new Map<string, Material[]>()
  for (const m of materiais) {
    if (!secoes.has(m.secao)) secoes.set(m.secao, [])
    secoes.get(m.secao)!.push(m)
  }

  return {
    ...produto,
    liberado: acessos.some((a) => a.revogado_em === null),
    secoes: [...secoes.entries()].map(([secao, itens]) => ({ secao, itens })),
  }
})

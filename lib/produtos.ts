import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type Produto = {
  id: string
  slug: string
  nome: string
  etiqueta: string | null
  descricao: string | null
  checkout_url: string | null
  tipo: string
  destaques: string[]
  /** Sigla, estado e data da prova vêm do concurso do produto (tabela concursos). */
  concurso: string | null
  uf: string | null
  data_prova: string | null
}

export type ProdutoDoAluno = Produto & { liberado: boolean }

export type Material = {
  id: string
  secao: string
  titulo: string
  descricao: string | null
  aberto: boolean
}

const CAMPOS_PRODUTO = 'id, slug, nome, etiqueta, descricao, checkout_url, tipo, destaques, concursos(sigla, uf, data_prova)'

type ProdutoDoBanco = Omit<Produto, 'concurso' | 'uf' | 'data_prova'> & {
  concursos: { sigla: string; uf: string; data_prova: string | null } | null
}

function comConcurso<T extends ProdutoDoBanco>({ concursos, ...p }: T) {
  return { ...p, concurso: concursos?.sigla ?? null, uf: concursos?.uf ?? null, data_prova: concursos?.data_prova ?? null }
}

/** Todos os produtos ativos, marcando quais o aluno já tem. Liberados vêm primeiro. */
export async function getProdutosDoAluno(alunoId: string): Promise<ProdutoDoAluno[]> {
  const supabase = await createClient()

  const [{ data: produtos }, { data: acessos }] = await Promise.all([
    supabase.from('produtos').select(CAMPOS_PRODUTO).order('ordem').returns<ProdutoDoBanco[]>(),
    supabase.from('acessos').select('produto_id').eq('aluno_id', alunoId).is('revogado_em', null),
  ])

  const liberados = new Set((acessos ?? []).map((a) => a.produto_id as string))

  return (produtos ?? [])
    .map((p) => ({ ...comConcurso(p), liberado: liberados.has(p.id) }))
    .sort((a, b) => Number(b.liberado) - Number(a.liberado))
}

export type UltimoAberto = {
  id: string
  titulo: string
  secao: string
  produto: { nome: string; slug: string }
}

type LinhaAberto = { materiais: Omit<UltimoAberto, 'produto'> & { produtos: UltimoAberto['produto'] } }

/**
 * Último material que o aluno abriu ("continuar de onde parou").
 * O !inner descarta o que ele não enxerga mais (ex.: acesso revogado).
 */
export async function getUltimoAberto(alunoId: string): Promise<UltimoAberto | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('materiais_abertos')
    .select('materiais!inner(id, titulo, secao, produtos!inner(nome, slug))')
    .eq('aluno_id', alunoId)
    .order('aberto_em', { ascending: false })
    .limit(1)
    .maybeSingle<LinhaAberto>()

  if (!data) return null

  const { produtos, ...material } = data.materiais
  return { ...material, produto: produtos }
}

export type ProdutoComMateriais = ProdutoDoAluno & { secoes: { secao: string; itens: Material[] }[] }

type LinhaMaterial = Omit<Material, 'aberto'> & { materiais_abertos: { aberto_em: string }[] }
type LinhaProduto = ProdutoDoBanco & { acessos: { revogado_em: string | null }[]; materiais: LinhaMaterial[] }

/**
 * Um produto pelo slug + se o aluno tem acesso + materiais agrupados por seção, em uma consulta só.
 * A segurança do banco só devolve os acessos do próprio aluno e os materiais dos produtos liberados.
 * Com cache(): o título da aba e a página compartilham a mesma consulta na requisição.
 */
export const getProdutoComMateriais = cache(async (slug: string): Promise<ProdutoComMateriais | null> => {
  const supabase = await createClient()

  const { data } = await supabase
    .from('produtos')
    .select(`${CAMPOS_PRODUTO}, acessos(revogado_em), materiais(id, secao, titulo, descricao, materiais_abertos(aberto_em))`)
    .eq('slug', slug)
    .order('ordem', { referencedTable: 'materiais' })
    .maybeSingle<LinhaProduto>()

  if (!data) return null

  const { acessos, materiais, ...produto } = data

  const secoes = new Map<string, Material[]>()
  for (const { materiais_abertos, ...m } of materiais) {
    if (!secoes.has(m.secao)) secoes.set(m.secao, [])
    secoes.get(m.secao)!.push({ ...m, aberto: materiais_abertos.length > 0 })
  }

  return {
    ...comConcurso(produto),
    liberado: acessos.some((a) => a.revogado_em === null),
    secoes: [...secoes.entries()].map(([secao, itens]) => ({ secao, itens })),
  }
})

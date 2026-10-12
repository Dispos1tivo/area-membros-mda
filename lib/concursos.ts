import { createClient } from '@/lib/supabase/server'

export type Concurso = {
  id: string
  sigla: string
  orgao: string
  cargo: string | null
  uf: string
  estado: string
  situacao: 'aberto' | 'previsto' | 'anunciado'
  vagas: string | null
  banca: string | null
  previsao: string | null
  inscricoes_inicio: string | null
  inscricoes_fim: string | null
  data_prova: string | null
  fonte_url: string | null
  pagina_url: string | null
  atualizado_em: string
}

const CAMPOS_CONCURSO =
  'id, sigla, orgao, cargo, uf, estado, situacao, vagas, banca, previsao, inscricoes_inicio, inscricoes_fim, data_prova, fonte_url, pagina_url, atualizado_em'

/** Concursos ativos, na ordem do cadastro (filtro por estado e radar de editais). */
export async function getConcursos(): Promise<Concurso[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('concursos').select(CAMPOS_CONCURSO).order('ordem').returns<Concurso[]>()
  return data ?? []
}

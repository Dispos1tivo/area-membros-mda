'use client'

import { useState } from 'react'
import type { Concurso } from '@/lib/concursos'
import type { ProdutoDoAluno } from '@/lib/produtos'
import { CardProduto } from './CardProduto'
import { RadarEditais } from './RadarEditais'

/** Radar de editais e listas de produtos do painel, com filtro por estado (e por concurso dentro do estado). */
export function PainelProdutos({ produtos, concursos }: { produtos: ProdutoDoAluno[]; concursos: Concurso[] }) {
  const [uf, setUf] = useState<string | null>(null)
  const [sigla, setSigla] = useState<string | null>(null)

  const estados = [...new Map(concursos.map((c) => [c.uf, c.estado])).entries()]
  const concursosDoEstado = uf ? concursos.filter((c) => c.uf === uf) : []

  const concursosVisiveis = concursos.filter((c) => (!uf || c.uf === uf) && (!sigla || c.sigla === sigla))
  const visiveis = produtos.filter((p) => (!uf || p.uf === uf) && (!sigla || p.concurso === sigla))

  const meus = produtos.filter((p) => p.liberado)
  // Para cada concurso, o primeiro produto que o aluno já tem (os bloqueados "combinam" com ele).
  const meuPorConcurso = new Map<string, string>()
  for (const p of meus) {
    if (p.concurso && !meuPorConcurso.has(p.concurso)) meuPorConcurso.set(p.concurso, p.nome)
  }

  const liberados = visiveis.filter((p) => p.liberado)
  const bloqueados = visiveis.filter((p) => !p.liberado)
  const complementos = bloqueados.filter((p) => p.concurso && meuPorConcurso.has(p.concurso))
  const outros = bloqueados.filter((p) => !complementos.includes(p))

  const filtrado = sigla ? `da ${sigla}` : `de ${estados.find(([u]) => u === uf)?.[1]}`

  function escolherEstado(novo: string | null) {
    setUf(novo)
    setSigla(null)
  }

  return (
    <>
      {estados.length > 1 && (
        <div className="filtros-bloco">
          <div className="filtros" role="group" aria-label="Filtrar por estado">
            <button type="button" className="filtro" aria-pressed={uf === null} onClick={() => escolherEstado(null)}>
              Todos
            </button>
            {estados.map(([u, nome]) => (
              <button key={u} type="button" className="filtro" aria-pressed={uf === u} onClick={() => escolherEstado(u)}>
                {nome}
              </button>
            ))}
          </div>

          {concursosDoEstado.length > 1 && (
            <div className="filtros filtros-sub" role="group" aria-label="Filtrar por concurso">
              <button type="button" className="filtro" aria-pressed={sigla === null} onClick={() => setSigla(null)}>
                Todos os concursos
              </button>
              {concursosDoEstado.map((c) => (
                <button key={c.sigla} type="button" className="filtro" aria-pressed={sigla === c.sigla} onClick={() => setSigla(c.sigla)}>
                  {c.sigla}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {concursosVisiveis.length > 0 && (
        <section className="secao" aria-labelledby="titulo-radar">
          <div>
            <h2 id="titulo-radar" className="secao-titulo">
              Radar de editais
            </h2>
            <p className="secao-sub">Como está cada concurso. Antes de se inscrever, confira sempre o edital oficial.</p>
          </div>
          <RadarEditais concursos={concursosVisiveis} produtos={produtos} />
        </section>
      )}

      <section className="secao" aria-labelledby="titulo-produtos">
        <h2 id="titulo-produtos" className="secao-titulo">
          Meus produtos
        </h2>

        {liberados.length > 0 ? (
          <div className="grade-produtos">
            {liberados.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
        ) : meus.length > 0 ? (
          <p className="secao-sub">Você ainda não tem materiais {filtrado}.</p>
        ) : (
          <div className="vazio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 8 12 3 3 8l9 5 9-5Z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
            <h3>Seus produtos vão aparecer aqui</h3>
            <p>Assim que sua compra for confirmada, os materiais são liberados automaticamente nesta página.</p>
          </div>
        )}
      </section>

      {complementos.length > 0 && (
        <section className="secao" aria-labelledby="titulo-complementos">
          <div>
            <h2 id="titulo-complementos" className="secao-titulo">
              Complete sua preparação
            </h2>
            <p className="secao-sub">Materiais do mesmo concurso que você já está estudando.</p>
          </div>
          <div className="grade-produtos">
            {complementos.map((p) => (
              <CardProduto key={p.id} produto={p} combinaCom={meuPorConcurso.get(p.concurso!)} />
            ))}
          </div>
        </section>
      )}

      {outros.length > 0 && (
        <section className="secao" aria-labelledby="titulo-outros">
          <h2 id="titulo-outros" className="secao-titulo">
            {meus.length > 0 ? 'Outros concursos' : 'Conheça os materiais'}
          </h2>
          <div className="grade-produtos">
            {outros.map((p) => (
              <CardProduto key={p.id} produto={p} discreto={meus.length > 0} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

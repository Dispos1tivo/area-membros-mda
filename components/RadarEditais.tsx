import type { Concurso } from '@/lib/concursos'
import type { ProdutoDoAluno } from '@/lib/produtos'
import { dataBR, diasAte, textoFaltam } from '@/lib/prova'
import { ESCUDOS } from './CapaProduto'

const SITUACOES: Record<Concurso['situacao'], string> = {
  aberto: 'Edital aberto',
  previsto: 'Previsto',
  anunciado: 'Anunciado',
}

function textoInscricoes({ inscricoes_inicio: inicio, inscricoes_fim: fim }: Concurso) {
  if (!fim) return null
  if (diasAte(fim) < 0) return `Encerradas em ${dataBR(fim)}`
  if (inicio && diasAte(inicio) > 0) return `De ${dataBR(inicio)} a ${dataBR(fim)}`
  return `Abertas até ${dataBR(fim)}`
}

/** O que o aluno tem deste concurso: "Você tem 1 de 2 materiais" ou o convite para conhecer. */
function Materiais({ concurso, produtos }: { concurso: Concurso; produtos: ProdutoDoAluno[] }) {
  const doConcurso = produtos.filter((p) => p.concurso === concurso.sigla)
  const tem = doConcurso.filter((p) => p.liberado).length

  if (tem > 0) {
    return <span>{tem === doConcurso.length ? 'Você já tem os materiais' : `Você tem ${tem} de ${doConcurso.length} materiais`}</span>
  }
  if (!concurso.pagina_url) return null
  return (
    <a href={concurso.pagina_url} target="_blank" rel="noopener">
      Conhecer o material
    </a>
  )
}

/** Um cartão por concurso: situação do edital, vagas, banca e datas. */
export function RadarEditais({ concursos, produtos }: { concursos: Concurso[]; produtos: ProdutoDoAluno[] }) {
  return (
    <div className="radar">
      {concursos.map((c) => {
        const inscricoes = textoInscricoes(c)
        const dias = c.data_prova ? diasAte(c.data_prova) : null

        return (
          <article key={c.id} className="edital">
            <header className="edital-topo">
              {ESCUDOS[c.sigla] && <img src={ESCUDOS[c.sigla]} alt="" />}
              <div>
                <h3>
                  {c.sigla}
                  {c.cargo && ` · ${c.cargo}`}
                </h3>
                <p>{c.estado}</p>
              </div>
              <span className={`situacao situacao-${c.situacao}`}>{SITUACOES[c.situacao]}</span>
            </header>

            <dl>
              <div>
                <dt>Vagas</dt>
                <dd>{c.vagas ?? 'A definir'}</dd>
              </div>
              <div>
                <dt>Banca</dt>
                <dd>{c.banca ?? 'A definir'}</dd>
              </div>
              {inscricoes && (
                <div>
                  <dt>Inscrições</dt>
                  <dd>{inscricoes}</dd>
                </div>
              )}
              {c.data_prova ? (
                <div>
                  <dt>Prova</dt>
                  <dd>{dataBR(c.data_prova)}</dd>
                </div>
              ) : (
                c.previsao && (
                  <div>
                    <dt>Edital</dt>
                    <dd>{c.previsao}</dd>
                  </div>
                )
              )}
            </dl>

            {dias !== null && dias >= 0 && <p className="edital-faltam">{textoFaltam(dias)} para a prova</p>}

            <footer className="edital-rodape">
              <Materiais concurso={c} produtos={produtos} />
              {c.fonte_url && (
                <a href={c.fonte_url} target="_blank" rel="noopener">
                  Site oficial
                </a>
              )}
              <span className="edital-nota">Atualizado em {dataBR(c.atualizado_em)}</span>
            </footer>
          </article>
        )
      })}
    </div>
  )
}

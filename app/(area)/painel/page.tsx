import type { Metadata } from 'next'
import Link from 'next/link'
import { PainelProdutos } from '@/components/PainelProdutos'
import { getAluno, primeiroNome } from '@/lib/aluno'
import { getConcursos } from '@/lib/concursos'
import { getProdutosDoAluno, getUltimoAberto } from '@/lib/produtos'
import { dataBR, proximaProva, textoFaltam } from '@/lib/prova'

export const metadata: Metadata = { title: 'Meus produtos' }

export default async function Painel() {
  const aluno = await getAluno()
  const nome = primeiroNome(aluno)
  const [produtos, ultimo, concursos] = await Promise.all([getProdutosDoAluno(aluno.id), getUltimoAberto(aluno.id), getConcursos()])

  const meus = produtos.filter((p) => p.liberado)
  const prova = proximaProva(meus)

  return (
    <>
      <section className="saudacao">
        <h1>{nome ? `Olá, ${nome}!` : 'Olá! Boas-vindas.'}</h1>
        <p>Aqui ficam todos os seus materiais do Método da Aprovação.</p>
      </section>

      {meus.length > 0 && (
        <section className={`inicio${prova ? '' : ' inicio-so'}`} aria-label="Seu estudo">
          {ultimo ? (
            <div className="continuar">
              <div className="continuar-info">
                <span className="rotulo">Continuar de onde parou</span>
                <h2>{ultimo.titulo}</h2>
                <p>
                  {ultimo.secao} · <Link href={`/produtos/${ultimo.produto.slug}`}>{ultimo.produto.nome}</Link>
                </p>
              </div>
              <a href={`/materiais/${ultimo.id}`} className="btn btn-ouro" target="_blank" rel="noopener">
                Continuar
              </a>
            </div>
          ) : (
            <div className="continuar">
              <div className="continuar-info">
                <span className="rotulo">Comece por aqui</span>
                <h2>{meus[0].nome}</h2>
                <p>Abra o primeiro material e ele fica guardado aqui para você continuar depois.</p>
              </div>
              <Link href={`/produtos/${meus[0].slug}`} className="btn btn-ouro">
                Começar
              </Link>
            </div>
          )}

          {prova && (
            <div className="contagem">
              <span className="rotulo">Prova da {prova.concurso}</span>
              <strong>{textoFaltam(prova.dias)}</strong>
              <span className="contagem-data">{dataBR(prova.data)}</span>
            </div>
          )}
        </section>
      )}

      <PainelProdutos produtos={produtos} concursos={concursos} />
    </>
  )
}

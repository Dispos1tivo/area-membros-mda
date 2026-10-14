import type { Metadata } from 'next'
import Link from 'next/link'
import { DestaqueApp } from '@/components/DestaqueApp'
import { PainelProdutos } from '@/components/PainelProdutos'
import { getAluno, primeiroNome } from '@/lib/aluno'
import { appDoAluno, temCombo } from '@/lib/app'
import { getConcursos } from '@/lib/concursos'
import { getProdutosDoAluno, getUltimoAberto } from '@/lib/produtos'

export const metadata: Metadata = { title: 'Meus produtos' }

export default async function Painel() {
  const aluno = await getAluno()
  const nome = primeiroNome(aluno)
  const [produtos, ultimo, concursos] = await Promise.all([getProdutosDoAluno(aluno.id), getUltimoAberto(aluno.id), getConcursos()])

  const meus = produtos.filter((p) => p.liberado)
  const { sigla, app } = appDoAluno(produtos)

  return (
    <>
      <section className="saudacao">
        <h1>{nome ? `Olá, ${nome}!` : 'Olá! Boas-vindas.'}</h1>
        <p>Aqui ficam todos os seus materiais do Método da Aprovação.</p>
      </section>

      {!aluno.temSenha && (
        <aside className="lembrete">
          {aluno.comSenhaInicial ? (
            <p>
              <strong>Troque sua senha inicial.</strong> Hoje ela é o CPF da compra; crie uma que só você conheça.
            </p>
          ) : (
            <p>
              <strong>Crie uma senha</strong> e entre direto, sem esperar o código chegar no e-mail.
            </p>
          )}
          <Link href="/perfil#senha" className="btn btn-contorno">
            {aluno.comSenhaInicial ? 'Trocar senha' : 'Criar senha'}
          </Link>
        </aside>
      )}

      <PainelProdutos produtos={produtos} concursos={concursos}>
        {meus.length > 0 && (
          <section aria-label="Seu estudo">
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
          </section>
        )}

        <DestaqueApp sigla={sigla} app={app} comCombo={sigla ? temCombo(produtos, sigla) : false} />
      </PainelProdutos>
    </>
  )
}

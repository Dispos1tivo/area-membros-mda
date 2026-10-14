import type { Metadata } from 'next'
import Link from 'next/link'
import { getAluno } from '@/lib/aluno'
import { APPS, APP_URL, PRECOS, appDoAluno, temCombo } from '@/lib/app'
import { getProdutosDoAluno } from '@/lib/produtos'

export const metadata: Metadata = { title: 'App de Estudos' }

type Props = { searchParams: Promise<{ concurso?: string }> }

const MOTIVA = [
  ['e-patentes.jpg', 'Patentes', 'De Recruta a Coronel: seu personagem ganha farda nova a cada promoção.'],
  ['e-missoes.jpg', 'Missões', 'Missões do dia e da semana que valem XP e méritos.'],
  ['e-ranking.jpg', 'Ranking semanal', 'Placar por XP, tempo de estudo ou questões respondidas.'],
]

export default async function PaginaApp({ searchParams }: Props) {
  const aluno = await getAluno()
  const [produtos, { concurso }] = await Promise.all([getProdutosDoAluno(aluno.id), searchParams])

  // Vale o concurso pedido no endereço; senão, o que o aluno estuda; quem ainda não tem produto vê o primeiro.
  const doAluno = appDoAluno(produtos)
  const pedido = concurso ? APPS[concurso.toUpperCase()] : undefined
  const app = pedido ?? doAluno.app ?? (doAluno.sigla ? null : Object.values(APPS)[0])
  const vitrine = app ?? Object.values(APPS)[0]

  const comCombo = app ? temCombo(produtos, app.sigla) : false
  const organiza = Boolean(app?.materialNoApp) && comCombo

  const telas = [
    ['c-cronograma.jpg', 'Cronograma automático', 'Sua semana montada pelo peso de cada matéria na prova e pela sua dificuldade.'],
    [vitrine.telas.edital, 'Edital verticalizado', 'O edital assunto por assunto, com teoria, revisão e questões. Você enxerga quanto já venceu.'],
    ['c-questao.jpg', 'Banco de questões', 'Gabarito comentado em cada resposta. O que você erra vai para o caderno de erros.'],
    [vitrine.telas.simulados, 'Simulados cronometrados', 'Prova com o tempo correndo e cartão-resposta. No fim, sua nota por matéria.'],
    ['c-revisoes.jpg', 'Revisões e flashcards', 'Revisões agendadas em 1, 7, 15, 30 e 60 dias e flashcards com repetição espaçada.'],
  ]

  return (
    <>
      <section className="app-hero">
        <div className="app-hero-info">
          <span className="rotulo">App de Estudos{app ? ` · ${app.nome}` : ''}</span>
          <h1>{organiza ? 'Você garantiu o material. Agora deixe o app organizar ele pra você.' : 'A plataforma de estudos do Método da Aprovação'}</h1>
          <p>
            {organiza
              ? 'As mesmas apostilas, simulados e bônus do seu Combo, dentro de uma plataforma que diz o que estudar hoje, corrige suas questões e agenda suas revisões.'
              : 'Ela diz o que estudar hoje, corrige suas questões e agenda suas revisões. Funciona no navegador do celular e do computador, sem instalar nada.'}
          </p>
          <div className="app-acoes">
            {app && (
              <a href="#planos" className="btn btn-ouro">
                Assinar o app
              </a>
            )}
            <a href={APP_URL} className="btn btn-ghost" target="_blank" rel="noopener">
              Já sou assinante
            </a>
          </div>
        </div>
        <div className="app-fone">
          <img src={`/app/telas/${vitrine.telas.inicio}`} alt="Tela inicial do app, com o plano de hoje, a patente e as revisões do dia" width={750} height={1624} />
        </div>
      </section>

      {!app && (
        <aside className="lembrete">
          <p>
            <strong>O App de Estudos da {doAluno.sigla} está em preparação.</strong> Por enquanto ele está disponível para os concursos abaixo.
          </p>
        </aside>
      )}

      <nav className="filtros" aria-label="Concurso do app">
        {Object.values(APPS).map((a) => (
          <Link key={a.sigla} href={`/app?concurso=${a.sigla}`} className="filtro" aria-current={a === app ? 'page' : undefined} scroll={false}>
            {a.nome}
          </Link>
        ))}
      </nav>

      <section className="secao" aria-labelledby="titulo-telas">
        <h2 id="titulo-telas" className="secao-titulo">
          Por dentro do app
        </h2>
        <div className="app-telas">
          {telas.map(([arquivo, titulo, texto]) => (
            <article key={titulo} className="app-tela">
              <img src={`/app/telas/${arquivo}`} alt="" width={686} height={686} loading="lazy" />
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>
      </section>

      {app && (
        <section className="secao" aria-labelledby="titulo-conteudo">
          <h2 id="titulo-conteudo" className="secao-titulo">
            O que tem no app da {app.sigla}
          </h2>
          <ul className="app-lista">
            {app.materialNoApp && (
              <li>
                <strong>Material do Combo da Aprovação</strong>: apostilas, simulados e bônus na Biblioteca, que guarda a página onde você parou
              </li>
            )}
            {app.extras.map(([forte, resto]) => (
              <li key={forte}>
                <strong>{forte}</strong>
                {resto}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="secao" aria-labelledby="titulo-motiva">
        <div>
          <h2 id="titulo-motiva" className="secao-titulo">
            Feito para você não parar
          </h2>
          <p className="secao-sub">Estudar todo dia sobe sua patente dentro do app.</p>
        </div>
        <div className="app-telas app-telas-3">
          {MOTIVA.map(([arquivo, titulo, texto]) => (
            <article key={titulo} className="app-tela">
              <img src={`/app/telas/${arquivo}`} alt="" width={686} height={514} loading="lazy" />
              <h3>{titulo}</h3>
              <p>{texto}</p>
            </article>
          ))}
        </div>
      </section>

      {app && (
        <section id="planos" className="secao" aria-labelledby="titulo-planos">
          <div>
            <h2 id="titulo-planos" className="secao-titulo">
              Planos · {app.nome}
            </h2>
            {comCombo && (
              <p className="secao-sub">
                Você tem o Combo da {app.sigla}: os R$ 47 que você pagou viram desconto no plano semestral.
              </p>
            )}
          </div>

          <div className="app-planos">
            <article className="app-plano">
              <h3>Mensal</h3>
              <p className="app-preco">
                R$ {PRECOS.mensal} <span>por mês</span>
              </p>
              <a href={app.links.mensal} className="btn btn-contorno" target="_blank" rel="noopener">
                Assinar o mensal
              </a>
            </article>

            <article className="app-plano app-plano-destaque">
              <h3>Semestral {comCombo && <span className="app-selo">preço de aluno</span>}</h3>
              {comCombo ? (
                <>
                  <p className="app-preco">
                    <s>R$ {PRECOS.combo.de}</s> R$ {PRECOS.combo.por} <span>por 6 meses</span>
                  </p>
                  <p className="app-nota">Mais R$ 0,99 de taxa de serviço do checkout.</p>
                </>
              ) : (
                <>
                  <p className="app-preco">
                    R$ {PRECOS.semestral} <span>por 6 meses</span>
                  </p>
                  <p className="app-nota">ou 6x de R$ {PRECOS.parcelaSemestral} no cartão</p>
                </>
              )}
              <a href={comCombo ? app.links.combo : app.links.semestral} className="btn btn-ouro" target="_blank" rel="noopener">
                Assinar o semestral
              </a>
            </article>

            <article className="app-plano">
              <h3>Anual</h3>
              <p className="app-preco">
                <s>R$ {PRECOS.anualRiscado}</s> R$ {PRECOS.anual} <span>por ano</span>
              </p>
              <p className="app-nota">ou 12x de R$ {PRECOS.parcelaAnual} no cartão</p>
              <a href={app.links.anual} className="btn btn-contorno" target="_blank" rel="noopener">
                Assinar o anual
              </a>
            </article>
          </div>

          <p className="secao-sub">Garantia de 14 dias. O pagamento é feito no checkout da Cakto, o mesmo do seu Combo.</p>
        </section>
      )}

      <section className="app-assinante" aria-labelledby="titulo-assinante">
        <div>
          <h2 id="titulo-assinante">Já é assinante?</h2>
          <p>
            O app tem login próprio: entre com o e-mail da compra e a senha do app. No primeiro acesso, ou se esqueceu a senha, use o link
            &quot;Primeiro acesso ou esqueci a senha&quot; na tela de entrada.
          </p>
        </div>
        <a href={APP_URL} className="btn btn-ouro" target="_blank" rel="noopener">
          Abrir o app
        </a>
      </section>
    </>
  )
}

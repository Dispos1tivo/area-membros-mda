import Link from 'next/link'
import { APPS, APP_URL, PRECOS, SIGLAS_DISPONIVEIS, type AppDoConcurso } from '@/lib/app'

type Props = {
  /** Concurso que o aluno estuda (null: ainda não tem produto). */
  sigla: string | null
  /** App desse concurso (null: ainda não é vendido para ele). */
  app: AppDoConcurso | null
  /** O aluno tem o Combo desse concurso. */
  comCombo: boolean
}

/** Bloco do App de Estudos no topo do painel: leva à página do app ou direto ao app, para quem já assina. */
export function DestaqueApp({ sigla, app, comCombo }: Props) {
  const emBreve = Boolean(sigla) && !app
  const vitrine = app ?? Object.values(APPS)[0]
  const organiza = Boolean(app?.materialNoApp) && comCombo

  return (
    <section className="app-destaque" aria-labelledby="titulo-app-destaque">
      <div className="app-fone app-fone-corte" aria-hidden="true">
        <img src={`/app/telas/${vitrine.telas.inicio}`} alt="" width={750} height={1624} />
      </div>

      <div className="app-destaque-info">
        <span className="rotulo">App de Estudos</span>
        <h2 id="titulo-app-destaque">A plataforma de estudos para concursos policiais e militares</h2>
        <p>
          {organiza
            ? 'As mesmas apostilas, simulados e bônus do seu Combo, dentro de uma plataforma que diz o que estudar hoje, corrige suas questões e agenda suas revisões.'
            : 'Ela diz o que estudar hoje, corrige suas questões e agenda suas revisões.'}
        </p>

        <ul className="selos">
          <li>Cronograma e revisões</li>
          <li>Questões e simulados</li>
          <li>Flashcards e mapas mentais</li>
        </ul>

        <p className="app-destaque-preco">
          Disponível para {SIGLAS_DISPONIVEIS}.{emBreve && ` Em breve para a ${sigla}.`}
        </p>

        {app && comCombo && (
          <p className="app-destaque-preco">
            Para quem tem o Combo: 6 meses por <strong>R$ {PRECOS.combo.por}</strong>, em vez de R$ {PRECOS.combo.de}.
          </p>
        )}

        <div className="app-acoes">
          <Link href={app ? `/app?concurso=${app.sigla}` : '/app'} className="btn btn-ouro">
            Conhecer o app
          </Link>
          {!emBreve && (
            <a href={APP_URL} className="btn btn-ghost" target="_blank" rel="noopener">
              Já sou assinante
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

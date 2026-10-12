import Link from 'next/link'
import type { ProdutoDoAluno } from '@/lib/produtos'
import { CapaProduto } from './CapaProduto'

type Props = {
  produto: ProdutoDoAluno
  /** Nome do produto que o aluno já tem e que este complementa. */
  combinaCom?: string
  /** Produto de um concurso que o aluno não estuda: aparece mais discreto. */
  discreto?: boolean
}

/** O cartão inteiro é clicável: o link do título cobre toda a área (ver .produto-link no CSS). */
export function CardProduto({ produto, combinaCom, discreto }: Props) {
  const { liberado, checkout_url } = produto

  return (
    <article className={`produto${discreto ? ' produto-discreto' : ''}`}>
      <CapaProduto concurso={produto.concurso} tipo={produto.tipo} etiqueta={produto.etiqueta} bloqueado={!liberado} apagada={discreto} />

      <div className="produto-info">
        <h3>
          {liberado ? (
            <Link href={`/produtos/${produto.slug}`} className="produto-link">
              {produto.nome}
            </Link>
          ) : checkout_url ? (
            <a href={checkout_url} className="produto-link" target="_blank" rel="noopener">
              {produto.nome}
            </a>
          ) : (
            produto.nome
          )}
        </h3>

        {combinaCom && <p className="produto-combina">Combina com o seu {combinaCom}</p>}

        {produto.destaques.length > 0 ? (
          <ul className="selos">
            {produto.destaques.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ) : (
          produto.descricao && <p>{produto.descricao}</p>
        )}
      </div>

      {liberado ? (
        <span className="btn btn-ouro btn-card" aria-hidden="true">
          Acessar
        </span>
      ) : checkout_url ? (
        <span className={`btn btn-card ${discreto ? 'btn-ghost' : 'btn-contorno'}`} aria-hidden="true">
          {discreto ? 'Conhecer' : 'Liberar acesso'}
        </span>
      ) : (
        <span className="btn btn-ghost btn-card" aria-disabled="true">
          Em breve
        </span>
      )}
    </article>
  )
}

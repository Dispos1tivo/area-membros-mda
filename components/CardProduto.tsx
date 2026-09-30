import Link from 'next/link'
import type { ProdutoDoAluno } from '@/lib/produtos'
import { CapaProduto } from './CapaProduto'

export function CardProduto({ produto }: { produto: ProdutoDoAluno }) {
  return (
    <article className={`produto${produto.liberado ? '' : ' produto-bloqueado'}`}>
      <CapaProduto etiqueta={produto.etiqueta} bloqueado={!produto.liberado} />

      <div className="produto-info">
        <h3>{produto.nome}</h3>
        {produto.descricao && <p>{produto.descricao}</p>}
      </div>

      {produto.liberado ? (
        <Link href={`/produtos/${produto.slug}`} className="btn btn-ouro btn-bloco">
          Acessar
        </Link>
      ) : produto.checkout_url ? (
        <a href={produto.checkout_url} className="btn btn-ghost btn-bloco" target="_blank" rel="noopener">
          Liberar acesso
        </a>
      ) : (
        <span className="btn btn-ghost btn-bloco" aria-disabled="true">
          Em breve
        </span>
      )}
    </article>
  )
}

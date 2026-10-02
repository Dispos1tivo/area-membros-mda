import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CapaProduto } from '@/components/CapaProduto'
import { getProdutoComMateriais } from '@/lib/produtos'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const produto = await getProdutoComMateriais(slug)
  return { title: produto?.nome ?? 'Produto' }
}

export default async function PaginaProduto({ params }: Props) {
  const { slug } = await params
  const produto = await getProdutoComMateriais(slug)

  if (!produto) notFound()

  const secoes = produto.liberado ? produto.secoes : []

  return (
    <>
      <Link href="/painel" className="voltar">
        ← Meus produtos
      </Link>

      <section className="produto-topo">
        <CapaProduto etiqueta={produto.etiqueta} bloqueado={!produto.liberado} />
        <div>
          <h1>{produto.nome}</h1>
          {produto.descricao && <p>{produto.descricao}</p>}
        </div>
      </section>

      {!produto.liberado ? (
        <div className="vazio">
          <h3>Você ainda não tem acesso a este produto</h3>
          <p>Garanta o seu acesso para liberar todos os materiais aqui na área de membros.</p>
          {produto.checkout_url && (
            <a href={produto.checkout_url} className="btn btn-ouro" target="_blank" rel="noopener">
              Liberar acesso
            </a>
          )}
        </div>
      ) : secoes.length === 0 ? (
        <div className="vazio">
          <h3>Os materiais estão sendo preparados</h3>
          <p>Em breve eles aparecem aqui. Você não precisa fazer nada: o acesso já está garantido.</p>
        </div>
      ) : (
        secoes.map(({ secao, itens }) => (
          <section key={secao} className="secao" aria-label={secao}>
            <h2 className="secao-titulo">{secao}</h2>
            <ul className="materiais">
              {itens.map((m) => (
                <li key={m.id} className="material">
                  <span className="material-icone" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                      <path d="M14 3v5h5M9 13h6M9 17h6" />
                    </svg>
                  </span>
                  <div className="material-info">
                    <h3>{m.titulo}</h3>
                    {m.descricao && <p>{m.descricao}</p>}
                  </div>
                  <a href={`/materiais/${m.id}`} className="btn btn-ghost btn-baixar" target="_blank" rel="noopener">
                    Abrir
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  )
}

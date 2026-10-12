import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CapaProduto } from '@/components/CapaProduto'
import { ItemMaterial } from '@/components/ItemMaterial'
import { getProdutoComMateriais } from '@/lib/produtos'
import { dataBR, diasAte, textoFaltam } from '@/lib/prova'

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
  const dias = produto.data_prova ? diasAte(produto.data_prova) : null

  return (
    <>
      <Link href="/painel" className="voltar">
        ← Meus produtos
      </Link>

      <section className="produto-topo">
        <CapaProduto concurso={produto.concurso} tipo={produto.tipo} etiqueta={produto.etiqueta} bloqueado={!produto.liberado} />
        <div>
          <h1>{produto.nome}</h1>
          {produto.descricao && <p>{produto.descricao}</p>}
          {produto.data_prova && dias !== null && dias >= 0 && (
            <p className="produto-prova">
              Prova em {dataBR(produto.data_prova)} · <strong>{textoFaltam(dias).toLowerCase()}</strong>
            </p>
          )}
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
                <ItemMaterial key={m.id} material={m} />
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  )
}

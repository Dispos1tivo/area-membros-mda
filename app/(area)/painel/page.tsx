import type { Metadata } from 'next'
import { CardProduto } from '@/components/CardProduto'
import { getAluno, primeiroNome } from '@/lib/aluno'
import { getProdutosDoAluno } from '@/lib/produtos'

export const metadata: Metadata = { title: 'Meus produtos' }

export default async function Painel() {
  const aluno = await getAluno()
  const nome = primeiroNome(aluno)
  const produtos = await getProdutosDoAluno(aluno.id)

  return (
    <>
      <section className="saudacao">
        <h1>{nome ? `Olá, ${nome}!` : 'Olá! Boas-vindas.'}</h1>
        <p>Aqui ficam todos os seus materiais do Método da Aprovação.</p>
      </section>

      <section className="secao" aria-labelledby="titulo-produtos">
        <h2 id="titulo-produtos" className="secao-titulo">
          Meus produtos
        </h2>

        {produtos.length > 0 ? (
          <div className="grade-produtos">
            {produtos.map((p) => (
              <CardProduto key={p.id} produto={p} />
            ))}
          </div>
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
    </>
  )
}

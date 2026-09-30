import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Nav } from '@/components/Nav'
import { getAluno } from '@/lib/aluno'

/** Moldura de todas as páginas logadas: topo com logo, menu e botão de sair. */
export default async function LayoutArea({ children }: { children: React.ReactNode }) {
  // Garante login também aqui (além do middleware).
  await getAluno()

  return (
    <>
      <header className="topo">
        <div className="container topo-inner">
          <Link href="/painel" aria-label="Ir para Meus produtos">
            <Logo className="logo" />
          </Link>
          <Nav />
          <form action="/auth/sair" method="post">
            <button className="btn btn-ghost btn-sair">Sair</button>
          </form>
        </div>
      </header>
      <main className="container conteudo">{children}</main>
    </>
  )
}

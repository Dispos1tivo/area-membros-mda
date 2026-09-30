import type { Metadata } from 'next'
import { Logo } from '@/components/Logo'
import { caminhoSeguro } from '@/lib/redirect'
import { FormLogin } from './FormLogin'

export const metadata: Metadata = { title: 'Entrar' }

const ERROS: Record<string, string> = {
  link: 'Esse link de acesso expirou ou já foi usado. Peça um novo abaixo.',
}

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string }>
}) {
  const { next, erro } = await searchParams

  return (
    <main className="login">
      <div className="login-caixa">
        <Logo className="logo" />
        <div className="card">
          <FormLogin next={caminhoSeguro(next)} erroInicial={erro ? ERROS[erro] : undefined} />
        </div>
        <p className="login-rodape">Dúvidas com o acesso? Fale com o nosso suporte.</p>
      </div>
    </main>
  )
}

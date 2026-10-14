'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/app', rotulo: 'App de Estudos', ativoEm: ['/app'], novo: true },
  { href: '/painel', rotulo: 'Meus produtos', ativoEm: ['/painel', '/produtos'] },
  { href: '/perfil', rotulo: 'Minha conta', ativoEm: ['/perfil'] },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="nav" aria-label="Navegação principal">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={l.ativoEm.some((p) => pathname.startsWith(p)) ? 'page' : undefined}>
          {l.rotulo}
          {l.novo && <span className="nav-novo">novo</span>}
        </Link>
      ))}
    </nav>
  )
}

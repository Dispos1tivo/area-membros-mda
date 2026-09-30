'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/painel', rotulo: 'Meus produtos' },
  { href: '/perfil', rotulo: 'Minha conta' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="nav" aria-label="Navegação principal">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={pathname.startsWith(l.href) ? 'page' : undefined}>
          {l.rotulo}
        </Link>
      ))}
    </nav>
  )
}

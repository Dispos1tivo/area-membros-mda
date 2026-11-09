import type { Metadata, Viewport } from 'next'
import { Saira } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

// Fontes da marca MDA Concursos: títulos em Zalando Sans Expanded (900), texto em Saira.
const saira = Saira({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-saira', display: 'swap' })
const zalando = localFont({
  src: './fonts/zalando-sans-expanded-900.woff2',
  weight: '900',
  variable: '--font-zalando',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Área de Membros', template: '%s · MDA Concursos' },
  description: 'Área de membros da MDA Concursos.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#09090B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${saira.variable} ${zalando.variable}`}>
      <body>{children}</body>
    </html>
  )
}

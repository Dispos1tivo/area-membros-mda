import type { Metadata, Viewport } from 'next'
import { Inter, Saira, Saira_Condensed } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const saira = Saira({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-saira', display: 'swap' })
const sairaCondensed = Saira_Condensed({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-saira-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Área de Membros', template: '%s · Método da Aprovação' },
  description: 'Área de membros do Método da Aprovação.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#09090B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${saira.variable} ${sairaCondensed.variable}`}>
      <body>{children}</body>
    </html>
  )
}

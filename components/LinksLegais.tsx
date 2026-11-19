/** Links da Política de Privacidade e dos Termos de Uso (páginas na Central de Links), mais o contato. */
export function LinksLegais({ className = '' }: { className?: string }) {
  return (
    <nav className={`links-legais ${className}`.trim()} aria-label="Documentos e contato">
      <a href="https://links.mdaconcursos.com.br/privacidade" target="_blank" rel="noopener">Política de Privacidade</a>
      <a href="https://links.mdaconcursos.com.br/termos" target="_blank" rel="noopener">Termos de Uso</a>
      <a href="https://wa.me/553388482719" target="_blank" rel="noopener">Contato: WhatsApp</a>
    </nav>
  )
}

/** Aceita só caminhos internos (ex.: "/painel"), para ninguém usar o login para redirecionar a outro site. */
export function caminhoSeguro(next: string | null | undefined, padrao = '/painel') {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return padrao
  return next
}

const ESTRELA = '0,-1 .2351,-.3236 .9511,-.309 .3804,.1236 .5878,.809 0,.4 -.5878,.809 -.3804,.1236 -.9511,-.309 -.2351,-.3236'

/** Capa padrão dos produtos: escudo da marca + selo (ex.: "PMMG 2027"). */
export function CapaProduto({ etiqueta, bloqueado }: { etiqueta: string | null; bloqueado?: boolean }) {
  return (
    <div className="produto-capa">
      <svg viewBox="40 12 160 190" aria-hidden="true">
        <path fill="#060607" stroke="currentColor" strokeWidth="8" d="M120 22 184 44V104c0 42-28 68-64 86-36-18-64-44-64-86V44z" />
        <polygon points={ESTRELA} fill="currentColor" transform="translate(120 98) scale(40)" />
      </svg>
      {etiqueta && <span className="produto-etiqueta">{etiqueta}</span>}
      {bloqueado && (
        <span className="produto-cadeado" aria-label="Bloqueado">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </span>
      )}
    </div>
  )
}

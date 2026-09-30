const ESTRELA = '0,-1 .2351,-.3236 .9511,-.309 .3804,.1236 .5878,.809 0,.4 -.5878,.809 -.3804,.1236 -.9511,-.309 -.2351,-.3236'

/** Logo "Método da Aprovação" (mesmo desenho da página de vendas). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 780 220" role="img" aria-label="Método da Aprovação">
      <g transform="translate(0 -10)">
        <g fill="#F6C111">
          <polygon points="2,62 52,62 52,78 16,78" />
          <polygon points="14,88 52,88 52,104 28,104" />
          <polygon points="26,114 52,114 52,130 40,130" />
          <polygon points="238,62 188,62 188,78 224,78" />
          <polygon points="226,88 188,88 188,104 212,104" />
          <polygon points="214,114 188,114 188,130 200,130" />
        </g>
        <path fill="#060607" stroke="#F6C111" strokeWidth="7" d="M120 22 184 44V104c0 42-28 68-64 86-36-18-64-44-64-86V44z" />
        <polygon points={ESTRELA} fill="#F6C111" transform="translate(120 98) scale(40)" />
        <polyline fill="none" stroke="#F6C111" strokeWidth="9" points="92,204 120,218 148,204" />
      </g>
      <rect fill="#F6C111" x="262" y="30" width="3" height="160" opacity=".5" />
      <g transform="translate(10 0) skewX(-8)">
        <text x="292" y="80" fontSize="46" fontWeight="800" letterSpacing="1.5" fill="#FAFAFA" style={{ fontFamily: 'var(--f-display)' }}>
          MÉTODO DA
        </text>
      </g>
      <g transform="translate(20 0) skewX(-8)">
        <text
          x="288"
          y="176"
          fontSize="112"
          fontWeight="900"
          fill="#F6C111"
          textLength="476"
          lengthAdjust="spacingAndGlyphs"
          style={{ fontFamily: 'var(--f-display)' }}
        >
          APROVAÇÃO
        </text>
      </g>
      <path fill="#F6C111" d="M292 196Q530 184 768 196Q530 190 292 196z" />
    </svg>
  )
}

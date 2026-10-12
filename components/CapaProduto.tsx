const ESTRELA = '0,-1 .2351,-.3236 .9511,-.309 .3804,.1236 .5878,.809 0,.4 -.5878,.809 -.3804,.1236 -.9511,-.309 -.2351,-.3236'

/**
 * Escudo de cada concurso (arquivo em /public/escudos). Para incluir um concurso,
 * salve a imagem lá e acrescente uma linha aqui. Sem arquivo, a capa usa o escudo da marca.
 */
export const ESCUDOS: Record<string, string> = {
  PMMG: '/escudos/pmmg.svg',
  PMPE: '/escudos/pmpe.png',
}

const TIPOS: Record<string, string> = {
  combo: 'Apostilas + simulados',
  mapas: 'Mapas mentais',
}

type Props = {
  concurso: string | null
  tipo: string
  etiqueta: string | null
  bloqueado?: boolean
  /** Capa sem cor: produto de um concurso que o aluno não estuda. */
  apagada?: boolean
}

/** Capa dos produtos: escudo e cor do concurso, desenho de fundo do tipo e selo (ex.: "PMMG 2027"). */
export function CapaProduto({ concurso, tipo, etiqueta, bloqueado, apagada }: Props) {
  const escudo = concurso ? ESCUDOS[concurso] : undefined

  return (
    <div className={`capa capa-${tipo}${apagada ? ' capa-apagada' : ''}`} data-concurso={concurso ?? undefined}>
      {concurso && (
        <span className="capa-sigla" aria-hidden="true">
          {concurso}
        </span>
      )}

      {escudo ? (
        <img className="capa-escudo" src={escudo} alt="" />
      ) : (
        <svg className="capa-escudo" viewBox="40 12 160 190" aria-hidden="true">
          <path className="capa-escudo-fundo" stroke="currentColor" strokeWidth="8" d="M120 22 184 44V104c0 42-28 68-64 86-36-18-64-44-64-86V44z" />
          <polygon points={ESTRELA} fill="currentColor" transform="translate(120 98) scale(40)" />
        </svg>
      )}

      <div className="capa-texto">
        {etiqueta && <span className="capa-etiqueta">{etiqueta}</span>}
        {TIPOS[tipo] && <span className="capa-tipo">{TIPOS[tipo]}</span>}
      </div>

      {bloqueado && (
        <span className="capa-cadeado" aria-label="Bloqueado">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </span>
      )}
    </div>
  )
}

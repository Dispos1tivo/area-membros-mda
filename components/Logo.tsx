/**
 * Logo MDA Concursos (arquivos oficiais do pacote da marca, em /public/marca).
 * A logo inteira não pode ficar menor que 210 px (regra da marca): onde não cabe, o CSS mostra só o símbolo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <img className="logo-inteira" src="/marca/mda-concursos-horizontal-fundo-escuro.svg" alt="MDA Concursos" width={210} height={53} />
      <img className="logo-simbolo" src="/marca/simbolo-ouro-para-fundo-escuro.svg" alt="" width={34} height={43} aria-hidden="true" />
    </span>
  )
}

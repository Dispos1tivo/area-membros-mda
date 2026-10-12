'use client'

import { useState } from 'react'
import type { Material } from '@/lib/produtos'

const ICONES: [prefixo: string, desenho: React.ReactNode][] = [
  // livro
  ['apostila', <path key="a" d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zm0 15a2 2 0 0 0 2 2h13M9 7h6" />],
  // prancheta com "certo"
  ['simulado', <path key="s" d="M9 4h6v3H9zM9 5H6v16h12V5h-3M9 14l2 2 4-4" />],
  // presente
  ['bônus', <path key="b" d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7c-1-3-5-4-5-1.5S10 7 12 7zm0 0c1-3 5-4 5-1.5S14 7 12 7z" />],
  // nós ligados
  ['mapa', <path key="m" d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM5 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM19 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM5 16.9a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM19 16.9a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM6.4 6.5l3.8 3.8M17.6 6.5l-3.8 3.8M6.4 17.5l3.8-3.8M17.6 17.5l-3.8-3.8" />],
]

const ARQUIVO = <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6" />

function iconeDaSecao(secao: string) {
  const s = secao.toLowerCase()
  return ICONES.find(([prefixo]) => s.startsWith(prefixo))?.[1] ?? ARQUIVO
}

/** Linha de um material. Marca "Já aberto" na hora do clique, sem esperar recarregar a página. */
export function ItemMaterial({ material }: { material: Material }) {
  const [aberto, setAberto] = useState(material.aberto)

  return (
    <li className={`material${aberto ? ' material-aberto' : ''}`}>
      <span className="material-icone" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {iconeDaSecao(material.secao)}
        </svg>
      </span>
      <div className="material-info">
        <h3>{material.titulo}</h3>
        {material.descricao && <p>{material.descricao}</p>}
        {aberto && <p className="material-visto">Já aberto</p>}
      </div>
      <a href={`/materiais/${material.id}`} className="btn btn-ghost btn-baixar" target="_blank" rel="noopener" onClick={() => setAberto(true)}>
        Abrir
      </a>
    </li>
  )
}

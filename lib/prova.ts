const DIA = 24 * 60 * 60 * 1000

/** Data de hoje (AAAA-MM-DD) no horário de Brasília, que é onde as provas acontecem. */
function hojeEmBrasilia() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

/** Dias que faltam até a data (AAAA-MM-DD). Negativo se já passou. */
export function diasAte(data: string) {
  return Math.round((Date.parse(data) - Date.parse(hojeEmBrasilia())) / DIA)
}

/** "2027-02-21" → "21/02/2027" */
export function dataBR(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export type Prova = { concurso: string; data: string; dias: number }

/** A prova mais próxima entre os produtos informados (ignora as que já passaram). */
export function proximaProva(produtos: { concurso: string | null; data_prova: string | null }[]): Prova | null {
  const provas = produtos
    .filter((p) => p.concurso && p.data_prova)
    .map((p) => ({ concurso: p.concurso!, data: p.data_prova!, dias: diasAte(p.data_prova!) }))
    .filter((p) => p.dias >= 0)
    .sort((a, b) => a.dias - b.dias)

  return provas[0] ?? null
}

export function textoFaltam(dias: number) {
  if (dias === 0) return 'É hoje'
  return dias === 1 ? 'Falta 1 dia' : `Faltam ${dias} dias`
}

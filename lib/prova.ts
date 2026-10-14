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

export function textoFaltam(dias: number) {
  if (dias === 0) return 'É hoje'
  return dias === 1 ? 'Falta 1 dia' : `Faltam ${dias} dias`
}

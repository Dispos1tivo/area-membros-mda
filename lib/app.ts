import type { ProdutoDoAluno } from './produtos'

/** Endereço do App de Estudos. O login de lá é próprio, separado do da área de membros. */
export const APP_URL = 'https://app.mdaconcursos.com.br'

export type AppDoConcurso = {
  sigla: string
  nome: string
  banca: string
  /** Capturas que mostram dados do concurso (arquivos em /public/app/telas). */
  telas: { inicio: string; edital: string; simulados: string }
  /** As apostilas, os simulados e os bônus do Combo já estão na Biblioteca do app deste concurso. */
  materialNoApp: boolean
  /** O que o app deste concurso tem: [destaque, resto da frase]. Só o que existe de fato lá. */
  extras: [string, string][]
  /** Checkouts da Cakto. `combo` é o semestral com o valor do Combo abatido, para quem já tem o Combo. */
  links: { mensal: string; semestral: string; anual: string; combo: string }
}

/**
 * App de Estudos de cada concurso. São os mesmos dados das fichas da página de vendas do app
 * (planos.mdaconcursos.com.br, pasta concursos/): ao mudar link, preço ou conteúdo lá, mude aqui.
 * Concurso sem linha aqui aparece como "em breve".
 */
export const APPS: Record<string, AppDoConcurso> = {
  PMPE: {
    sigla: 'PMPE',
    nome: 'PMPE 2026',
    banca: 'AOCP',
    telas: { inicio: 'pmpe-inicio.jpg', edital: 'pmpe-c-edital.jpg', simulados: 'pmpe-c-simulados.jpg' },
    materialNoApp: true,
    extras: [
      ['Flashcards', ' de revisão, com repetição espaçada'],
      ['Mapas mentais', ' de todas as matérias do edital'],
      ['Banco de questões comentadas', ': as 300 dos simulados, com filtro por matéria e caderno de erros'],
      ['Simulados cronometrados', ', com cartão-resposta e nota por matéria'],
      ['Treino para o TAF', ', com as metas de cada teste'],
    ],
    links: {
      mensal: 'https://pay.cakto.com.br/3fpjbve_1177979',
      semestral: 'https://pay.cakto.com.br/t5cqrzs_1177980',
      anual: 'https://pay.cakto.com.br/88nq9ea_1177975',
      combo: 'https://pay.cakto.com.br/n5negrj',
    },
  },
  PMMG: {
    sigla: 'PMMG',
    nome: 'PMMG 2027',
    banca: 'CRS',
    telas: { inicio: 'inicio.jpg', edital: 'c-edital.jpg', simulados: 'c-simulados.jpg' },
    materialNoApp: true,
    extras: [
      ['902 questões', ' com gabarito comentado, filtro por matéria e caderno de erros'],
      ['Flashcards', ' com repetição espaçada'],
      ['Mapas mentais interativos', ', com modo revisão'],
      ['Simulados cronometrados', ', com cartão-resposta e nota por matéria'],
    ],
    links: {
      mensal: 'https://pay.cakto.com.br/3cje9r5_1164427',
      semestral: 'https://pay.cakto.com.br/ua6uhmc_1164435',
      anual: 'https://pay.cakto.com.br/3f4scrx_1177088',
      combo: 'https://pay.cakto.com.br/35exfsb',
    },
  },
  PCMG: {
    sigla: 'PCMG',
    nome: 'PCMG',
    banca: 'FGV',
    telas: { inicio: 'pcmg-inicio.jpg', edital: 'pcmg-c-edital.jpg', simulados: 'pcmg-c-simulados.jpg' },
    materialNoApp: true,
    extras: [
      ['Flashcards', ' de revisão, com repetição espaçada'],
      ['Mapas mentais interativos', ' de todas as matérias do edital, com modo revisão'],
      ['Banco de questões comentadas', ': as 350 dos simulados, com filtro por matéria e caderno de erros'],
      ['Simulados cronometrados', ', com cartão-resposta e nota por matéria'],
      ['Treino para o TAF', ', com as metas de cada teste'],
    ],
    links: {
      mensal: 'https://pay.cakto.com.br/36m86yq_1200766',
      semestral: 'https://pay.cakto.com.br/36gppzb_1200761',
      anual: 'https://pay.cakto.com.br/8a2kf9i_1200767',
      combo: 'https://pay.cakto.com.br/n4p5hus',
    },
  },
}

/** Valores iguais em todos os concursos, já com a taxa de R$ 0,99 do checkout (menos a oferta do Combo). */
export const PRECOS = {
  mensal: '37,99',
  semestral: '147,99',
  parcelaSemestral: '28,42',
  anual: '247,99',
  parcelaAnual: '25,52',
  anualRiscado: '455,88',
  combo: { de: '147', por: '100' },
}

/** Concurso que o aluno estuda (o primeiro com app; senão, o primeiro que ele tem) e o app desse concurso. */
export function appDoAluno(produtos: ProdutoDoAluno[]) {
  const siglas = produtos.filter((p) => p.liberado && p.concurso).map((p) => p.concurso!)
  const sigla = siglas.find((s) => APPS[s]) ?? siglas[0] ?? null
  return { sigla, app: sigla ? (APPS[sigla] ?? null) : null }
}

/** Quem tem o Combo do concurso paga o semestral do app com o valor do Combo abatido. */
export function temCombo(produtos: ProdutoDoAluno[], sigla: string) {
  return produtos.some((p) => p.liberado && p.tipo === 'combo' && p.concurso === sigla)
}

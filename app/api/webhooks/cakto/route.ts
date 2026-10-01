import { timingSafeEqual } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Webhook da Cakto (https://docs.cakto.com.br/conceitos/webhooks)
 *
 * - purchase_approved  → cria o aluno (se for novo) e libera o produto
 * - refund / chargeback → revoga o acesso ao produto
 * - demais eventos      → só registra
 *
 * A Cakto espera resposta 2xx em até 8s e NÃO reenvia em resposta de erro,
 * por isso todo aviso fica registrado em `cakto_eventos` para conferência.
 * Repetir o mesmo aviso não causa problema (liberar/revogar são idempotentes).
 */

export const dynamic = 'force-dynamic'

const LIBERAM = new Set(['purchase_approved'])
const REVOGAM = new Set(['refund', 'chargeback'])

type PayloadCakto = {
  secret?: unknown
  event?: unknown
  data?: {
    id?: string
    refId?: string
    customer?: { name?: string; email?: string }
    product?: { id?: string; short_id?: string; name?: string }
    offer?: { id?: string }
    checkoutUrl?: string
  }
}

export async function POST(request: NextRequest) {
  let payload: PayloadCakto
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, erro: 'JSON inválido' }, { status: 400 })
  }

  if (!segredoConfere(payload.secret)) {
    return NextResponse.json({ ok: false, erro: 'Não autorizado' }, { status: 401 })
  }

  const evento = nomeDoEvento(payload.event)
  const dados = payload.data ?? {}
  const email = dados.customer?.email?.trim().toLowerCase() || null
  const produtoCaktoId = dados.product?.id ?? null
  const ofertaId = dados.offer?.id ?? null

  const db = createAdminClient()

  let resultado = 'ignorado'
  let detalhe: string | null = null

  try {
    if (LIBERAM.has(evento) || REVOGAM.has(evento)) {
      const produtoId = await acharProduto(db, produtoCaktoId, [
        ofertaId,
        dados.product?.short_id,
        codigoDoCheckout(dados.checkoutUrl),
      ])

      if (!email) {
        resultado = 'sem_email'
      } else if (!produtoId) {
        resultado = 'produto_desconhecido'
      } else if (LIBERAM.has(evento)) {
        const alunoId = await acharOuCriarAluno(db, email, dados.customer?.name)
        const { error } = await db.from('acessos').upsert({
          aluno_id: alunoId,
          produto_id: produtoId,
          origem: 'cakto',
          pedido_id: dados.id ?? null,
          liberado_em: new Date().toISOString(),
          revogado_em: null,
        })
        if (error) throw new Error(error.message)
        resultado = 'acesso_liberado'
      } else {
        const alunoId = await acharAluno(db, email)
        if (!alunoId) {
          resultado = 'aluno_nao_encontrado'
        } else {
          const { error } = await db
            .from('acessos')
            .update({ revogado_em: new Date().toISOString() })
            .eq('aluno_id', alunoId)
            .eq('produto_id', produtoId)
            .is('revogado_em', null)
          if (error) throw new Error(error.message)
          resultado = 'acesso_revogado'
        }
      }
    }
  } catch (e) {
    resultado = 'erro'
    detalhe = e instanceof Error ? e.message : String(e)
  }

  await db.from('cakto_eventos').insert({
    evento,
    resultado,
    pedido_id: dados.id ?? null,
    ref_id: dados.refId ?? null,
    email,
    produto_cakto_id: produtoCaktoId,
    produto_nome: dados.product?.name ?? null,
    oferta_id: ofertaId,
    detalhe,
  })

  return NextResponse.json({ ok: resultado !== 'erro', resultado }, { status: resultado === 'erro' ? 500 : 200 })
}

/** Compara o segredo do aviso com o configurado, sem vazar informação por tempo de resposta. */
function segredoConfere(recebido: unknown) {
  const esperado = process.env.CAKTO_WEBHOOK_SECRET
  if (!esperado || typeof recebido !== 'string') return false
  const a = Buffer.from(recebido)
  const b = Buffer.from(esperado)
  return a.length === b.length && timingSafeEqual(a, b)
}

function nomeDoEvento(event: unknown) {
  if (typeof event === 'string') return event
  if (event && typeof event === 'object' && 'custom_id' in event) return String(event.custom_id)
  return 'desconhecido'
}

/**
 * Descobre qual produto da área corresponde ao da Cakto:
 * 1) pelo id do produto na Cakto (coluna cakto_produto_id);
 * 2) senão, pelo código que aparece no link de checkout cadastrado
 *    (ex.: pay.cakto.com.br/e5ah5n8_1006158 → "e5ah5n8"), comparado com a
 *    oferta, o código curto do produto e o checkoutUrl do aviso — e aí já
 *    grava o id do produto, para as próximas vendas caírem no caso 1.
 */
async function acharProduto(
  db: SupabaseClient,
  produtoCaktoId: string | null,
  codigos: (string | null | undefined)[],
) {
  if (produtoCaktoId) {
    const { data } = await db.from('produtos').select('id').eq('cakto_produto_id', produtoCaktoId).maybeSingle()
    if (data) return data.id as string
  }

  const candidatos = new Set(codigos.filter((c): c is string => !!c).map((c) => c.toLowerCase()))
  if (candidatos.size > 0) {
    const { data } = await db
      .from('produtos')
      .select('id, checkout_url')
      .is('cakto_produto_id', null)
      .not('checkout_url', 'is', null)
    const achado = data?.find((p) => {
      const codigo = codigoDoCheckout(p.checkout_url)
      return !!codigo && candidatos.has(codigo)
    })
    if (achado) {
      if (produtoCaktoId) await db.from('produtos').update({ cakto_produto_id: produtoCaktoId }).eq('id', achado.id)
      return achado.id as string
    }
  }

  return null
}

/** "https://pay.cakto.com.br/e5ah5n8_1006158" → "e5ah5n8" */
function codigoDoCheckout(url: string | null | undefined) {
  if (!url) return null
  try {
    const ultimo = new URL(url).pathname.split('/').filter(Boolean).pop()
    return ultimo?.split('_')[0]?.toLowerCase() || null
  } catch {
    return null
  }
}

async function acharAluno(db: SupabaseClient, email: string) {
  const { data } = await db.from('perfis').select('id').eq('email', email).maybeSingle()
  return (data?.id as string | undefined) ?? null
}

async function acharOuCriarAluno(db: SupabaseClient, email: string, nome?: string) {
  const existente = await acharAluno(db, email)
  if (existente) return existente

  const { data, error } = await db.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: nome ? { nome: nome.trim() } : undefined,
  })
  if (data?.user) return data.user.id

  // Dois avisos do mesmo comprador ao mesmo tempo (ex.: produto + order bump):
  // o outro acabou de criar o aluno.
  const criadoPorOutro = await acharAluno(db, email)
  if (criadoPorOutro) return criadoPorOutro

  throw new Error(`Não foi possível criar o aluno: ${error?.message ?? 'erro desconhecido'}`)
}

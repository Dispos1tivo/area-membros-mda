import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * E-mail de boas-vindas depois da compra, enviado pela API da Resend
 * (mesmo domínio verificado dos códigos de login: acesso@mdaconcursos.com.br).
 *
 * Combo + order bump chegam em avisos separados da Cakto, quase ao mesmo tempo.
 * Por isso quem chama espera alguns segundos e então "pega" de uma vez todas
 * as liberações recentes do aluno que ainda não tiveram e-mail: só um aviso
 * consegue pegá-las, e o aluno recebe um único e-mail com tudo.
 */

const AREA_URL = 'https://membros.mdaconcursos.com.br'
const REMETENTE = 'MDA Concursos <acesso@mdaconcursos.com.br>'
const JANELA_MINUTOS = 15

export type ResultadoBoasVindas = 'enviado' | 'nada_a_enviar' | 'sem_chave' | `erro: ${string}`

export async function enviarBoasVindas(db: SupabaseClient, alunoId: string, email: string): Promise<ResultadoBoasVindas> {
  const chave = process.env.RESEND_API_KEY
  if (!chave) return 'sem_chave'

  const desde = new Date(Date.now() - JANELA_MINUTOS * 60_000).toISOString()
  const { data: pegos, error } = await db
    .from('acessos')
    .update({ boas_vindas_em: new Date().toISOString() })
    .eq('aluno_id', alunoId)
    .is('boas_vindas_em', null)
    .is('revogado_em', null)
    .gte('liberado_em', desde)
    .select('produto_id, produtos(nome)')
  if (error) return `erro: ${error.message}`
  if (!pegos || pegos.length === 0) return 'nada_a_enviar'

  const produtos = pegos
    .map((p) => (p.produtos as unknown as { nome: string } | null)?.nome)
    .filter((n): n is string => !!n)

  const { data: usuario } = await db.auth.admin.getUserById(alunoId)
  const meta = (usuario?.user?.user_metadata ?? {}) as { nome?: string; senha_definida?: boolean; senha_inicial?: boolean }
  const comoEntrar: ComoEntrar = meta.senha_definida ? 'senha_propria' : meta.senha_inicial ? 'cpf' : 'codigo'
  const primeiroNome = meta.nome?.trim().split(/\s+/)[0]

  try {
    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: REMETENTE,
        to: [email],
        subject: 'Seu acesso está liberado · MDA Concursos',
        html: montarHtml({ primeiroNome, produtos, email, comoEntrar }),
        text: montarTexto({ primeiroNome, produtos, email, comoEntrar }),
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!resposta.ok) throw new Error(`Resend ${resposta.status}: ${(await resposta.text()).slice(0, 200)}`)
    return 'enviado'
  } catch (e) {
    // Devolve as liberações para uma nova tentativa (próximo aviso ou envio manual).
    await db
      .from('acessos')
      .update({ boas_vindas_em: null })
      .eq('aluno_id', alunoId)
      .in('produto_id', pegos.map((p) => p.produto_id))
    return `erro: ${e instanceof Error ? e.message : String(e)}`
  }
}

type ComoEntrar = 'cpf' | 'senha_propria' | 'codigo'
type Dados = { primeiroNome?: string; produtos: string[]; email: string; comoEntrar: ComoEntrar }

function instrucaoSenha(comoEntrar: ComoEntrar) {
  if (comoEntrar === 'cpf') return 'Senha: os números do seu CPF (o mesmo usado na compra, sem pontos nem traço).'
  if (comoEntrar === 'senha_propria') return 'Senha: a mesma que você já usa na Área de Membros.'
  return 'Na tela de login, toque em "Entrar com código por e-mail" e digite o código que vamos te enviar.'
}

function montarTexto({ primeiroNome, produtos, email, comoEntrar }: Dados) {
  return [
    `Olá${primeiroNome ? `, ${primeiroNome}` : ''}! Sua compra foi aprovada e seu acesso já está liberado:`,
    '',
    ...produtos.map((p) => `- ${p}`),
    '',
    `Entre em ${AREA_URL}/login`,
    `E-mail: ${email}`,
    instrucaoSenha(comoEntrar),
    '',
    'Se esquecer a senha, use "Esqueci minha senha" na tela de login.',
    '',
    'Bons estudos!',
    'Equipe MDA Concursos',
  ].join('\n')
}

function montarHtml({ primeiroNome, produtos, email, comoEntrar }: Dados) {
  const itens = produtos
    .map(
      (p) =>
        `<li style="margin:0 0 8px;padding:12px 14px;background:#1C1C21;border:1px solid #26262B;border-radius:10px;font-size:15px;color:#FAFAFA">${escapar(p)}</li>`,
    )
    .join('')

  return `<div style="background:#09090B;padding:32px 16px;font-family:Segoe UI,Arial,sans-serif;color:#FAFAFA">
  <div style="max-width:480px;margin:0 auto;background:#141417;border:1px solid #26262B;border-radius:14px;padding:32px">
    <p style="margin:0 0 20px;text-align:center"><img src="${AREA_URL}/marca/mda-concursos-horizontal-fundo-escuro-1200.png" width="210" alt="MDA Concursos" style="display:inline-block;width:210px;height:auto;border:0"></p>
    <h1 style="margin:0 0 12px;font-size:22px;text-align:center">Seu acesso está liberado</h1>
    <p style="margin:0 0 20px;color:#A1A1AA;font-size:15px;line-height:1.5;text-align:center">Olá${primeiroNome ? `, ${escapar(primeiroNome)}` : ''}! Sua compra foi aprovada. Já está tudo na sua Área de Membros:</p>

    <ul style="list-style:none;margin:0 0 24px;padding:0">${itens}</ul>

    <div style="margin:0 0 24px;padding:16px;border-radius:10px;background:#1C1C21;border:1px solid #26262B;font-size:14px;line-height:1.6;color:#D4D4D8">
      <p style="margin:0 0 6px;color:#F6C111;font-weight:700">Como entrar</p>
      <p style="margin:0">E-mail: <strong style="color:#FAFAFA">${escapar(email)}</strong></p>
      <p style="margin:0">${escapar(instrucaoSenha(comoEntrar))}</p>
    </div>

    <div style="text-align:center">
      <a href="${AREA_URL}/login" style="display:inline-block;background:#F6C111;color:#111;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:10px">Entrar na Área de Membros</a>
    </div>

    <p style="margin:28px 0 0;color:#71717A;font-size:12px;line-height:1.5;text-align:center">Se esquecer a senha, use "Esqueci minha senha" na tela de login.<br>Bons estudos!</p>
  </div>
</div>`
}

function escapar(texto: string) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

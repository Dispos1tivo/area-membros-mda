'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

type Etapa = 'email' | 'codigo'

/**
 * Login sem senha em 2 passos:
 * 1) aluno informa o e-mail da compra → recebe e-mail com link + código
 * 2) clica no link (vai para /auth/confirm) OU digita o código aqui
 * O código resolve quem abre o e-mail em outro aparelho ou no navegador do Instagram.
 */
export function FormLogin({ next, erroInicial }: { next: string; erroInicial?: string }) {
  const router = useRouter()
  const [etapa, setEtapa] = useState<Etapa>('email')
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(erroInicial ?? '')
  const [info, setInfo] = useState('')

  async function enviarAcesso(e?: FormEvent) {
    e?.preventDefault()
    setCarregando(true)
    setErro('')
    setInfo('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        // Só entra quem já é aluno (a conta é criada na compra, não aqui).
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
      },
    })

    setCarregando(false)

    if (error) {
      setErro(traduzirErro(error.message, error.status))
      return
    }
    setEtapa('codigo')
    setInfo(`Enviamos um link e um código de acesso para ${email.trim().toLowerCase()}.`)
  }

  async function confirmarCodigo(e: FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: codigo.trim(),
      type: 'email',
    })

    if (error) {
      setCarregando(false)
      setErro('Código inválido ou expirado. Confira o e-mail ou peça um novo código.')
      return
    }
    router.replace(next)
    router.refresh()
  }

  if (etapa === 'codigo') {
    return (
      <form onSubmit={confirmarCodigo}>
        <div>
          <h1 className="login-titulo">Confira seu e-mail</h1>
          <p className="login-sub">Clique no link que enviamos ou digite o código abaixo.</p>
        </div>
        {info && <p className="aviso aviso-ok">{info}</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}
        <div className="campo">
          <label htmlFor="codigo">Código de acesso</label>
          <input
            id="codigo"
            className="input input-codigo"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6,10}"
            maxLength={10}
            required
            autoFocus
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        <button className="btn btn-ouro btn-bloco" disabled={carregando}>
          {carregando ? 'Entrando…' : 'Entrar'}
        </button>
        <div className="login-acoes">
          <button type="button" className="link-btn" onClick={() => enviarAcesso()} disabled={carregando}>
            Reenviar código
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setEtapa('email')
              setCodigo('')
              setErro('')
              setInfo('')
            }}
          >
            Trocar e-mail
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={enviarAcesso}>
      <div>
        <h1 className="login-titulo">Área de Membros</h1>
        <p className="login-sub">Entre com o mesmo e-mail que você usou na compra.</p>
      </div>
      {erro && <p className="aviso aviso-erro">{erro}</p>}
      <div className="campo">
        <label htmlFor="email">Seu e-mail</label>
        <input
          id="email"
          type="email"
          className="input"
          autoComplete="email"
          placeholder="voce@email.com"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="btn btn-ouro btn-bloco" disabled={carregando}>
        {carregando ? 'Enviando…' : 'Receber acesso por e-mail'}
      </button>
    </form>
  )
}

function traduzirErro(mensagem: string, status?: number) {
  const m = mensagem.toLowerCase()
  if (m.includes('signups not allowed') || m.includes('user not found')) {
    return 'Não encontramos uma compra com esse e-mail. Use o mesmo e-mail que você informou no pagamento.'
  }
  if (status === 429 || m.includes('rate limit') || m.includes('security purposes')) {
    return 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.'
  }
  if (m.includes('invalid') && m.includes('email')) {
    return 'Esse e-mail parece inválido. Confira e tente de novo.'
  }
  return 'Não foi possível enviar o acesso agora. Tente novamente em instantes.'
}

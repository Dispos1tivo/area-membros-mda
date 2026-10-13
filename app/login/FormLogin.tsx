'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

type Etapa = 'entrar' | 'codigo'

/** Para onde vai quem entra pelo código porque ainda não tem (ou esqueceu) a senha. */
const CRIAR_SENHA = '/perfil?senha=criar#senha'

/**
 * Duas formas de entrar, na mesma tela:
 * - e-mail + senha (a inicial é o CPF da compra, definido pelo webhook; o aluno troca em Minha conta);
 * - código por e-mail: o aluno recebe link + código, clica no link (vai para
 *   /auth/confirm) OU digita o código aqui. É o caminho de quem esqueceu a senha
 *   e de quem comprou antes de existir a senha inicial.
 */
export function FormLogin({ next, erroInicial }: { next: string; erroInicial?: string }) {
  const router = useRouter()
  const campoEmail = useRef<HTMLInputElement>(null)
  const [etapa, setEtapa] = useState<Etapa>('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [destino, setDestino] = useState(next)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(erroInicial ?? '')
  const [info, setInfo] = useState('')

  const emailLimpo = email.trim().toLowerCase()

  async function entrarComSenha(e: FormEvent) {
    e.preventDefault()
    if (!senha) {
      setErro('Digite sua senha. No primeiro acesso, ela é o CPF usado na compra; ou entre com o código por e-mail.')
      return
    }
    setCarregando(true)
    setErro('')

    const supabase = createClient()
    let { error } = await supabase.auth.signInWithPassword({ email: emailLimpo, password: senha })

    // Senha inicial = CPF só com números. Se o aluno digitou com pontos e traço, tenta sem eles.
    const soNumeros = senha.replace(/\D/g, '')
    if (error && soNumeros !== senha && (soNumeros.length === 11 || soNumeros.length === 14)) {
      ;({ error } = await supabase.auth.signInWithPassword({ email: emailLimpo, password: soNumeros }))
    }

    if (error) {
      setCarregando(false)
      setErro(traduzirErro(error.message, error.status, 'senha'))
      return
    }
    router.replace(next)
    router.refresh()
  }

  async function enviarCodigo(destinoAposEntrar: string) {
    // O botão do código não envia o formulário, então confere o e-mail aqui.
    if (!campoEmail.current?.reportValidity()) return

    setCarregando(true)
    setErro('')
    setInfo('')
    setDestino(destinoAposEntrar)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: emailLimpo,
      options: {
        // Só entra quem já é aluno (a conta é criada na compra, não aqui).
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(destinoAposEntrar)}`,
      },
    })

    setCarregando(false)

    if (error) {
      setErro(traduzirErro(error.message, error.status, 'codigo'))
      return
    }
    setEtapa('codigo')
    setInfo(`Enviamos um link e um código de acesso para ${emailLimpo}. Não achou? Olhe também no spam ou lixo eletrônico.`)
  }

  async function confirmarCodigo(e: FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      email: emailLimpo,
      token: codigo.trim(),
      type: 'email',
    })

    if (error) {
      setCarregando(false)
      setErro('Código inválido ou expirado. Confira o e-mail ou peça um novo código.')
      return
    }
    router.replace(destino)
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
          <button type="button" className="link-btn" onClick={() => enviarCodigo(destino)} disabled={carregando}>
            Reenviar código
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setEtapa('entrar')
              setCodigo('')
              setErro('')
              setInfo('')
            }}
          >
            Voltar
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={entrarComSenha}>
      <div>
        <h1 className="login-titulo">Área de Membros</h1>
        <p className="login-sub">Entre com o mesmo e-mail que você usou na compra.</p>
      </div>
      {erro && <p className="aviso aviso-erro">{erro}</p>}
      <div className="campo">
        <label htmlFor="email">Seu e-mail</label>
        <input
          ref={campoEmail}
          id="email"
          type="email"
          className="input"
          autoComplete="username"
          placeholder="voce@email.com"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="campo">
        <div className="campo-topo">
          <label htmlFor="senha">Sua senha</label>
          <button type="button" className="link-btn" onClick={() => setMostrarSenha((v) => !v)} aria-pressed={mostrarSenha}>
            {mostrarSenha ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <input
          id="senha"
          type={mostrarSenha ? 'text' : 'password'}
          className="input"
          autoComplete="current-password"
          maxLength={72}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>
      <button className="btn btn-ouro btn-bloco" disabled={carregando}>
        {carregando ? 'Aguarde…' : 'Entrar'}
      </button>
      <button type="button" className="link-btn" onClick={() => enviarCodigo(CRIAR_SENHA)} disabled={carregando}>
        Esqueci minha senha
      </button>

      <p className="login-ou">ou</p>

      <button type="button" className="btn btn-ghost btn-bloco" onClick={() => enviarCodigo(next)} disabled={carregando}>
        Entrar com código por e-mail
      </button>
      <p className="login-dica">
        <strong>Primeiro acesso?</strong> Sua senha inicial é o CPF usado na compra, só os números. Se não funcionar, entre com o código por e-mail.
      </p>
    </form>
  )
}

function traduzirErro(mensagem: string, status: number | undefined, modo: 'senha' | 'codigo') {
  const m = mensagem.toLowerCase()
  if (m.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos. No primeiro acesso, a senha é o CPF usado na compra. Se não funcionar, entre com o código por e-mail.'
  }
  if (m.includes('signups not allowed') || m.includes('user not found')) {
    return 'Não encontramos uma compra com esse e-mail. Use o mesmo e-mail que você informou no pagamento.'
  }
  if (status === 429 || m.includes('rate limit') || m.includes('security purposes')) {
    return 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.'
  }
  if (m.includes('invalid') && m.includes('email')) {
    return 'Esse e-mail parece inválido. Confira e tente de novo.'
  }
  return modo === 'senha'
    ? 'Não foi possível entrar agora. Tente novamente em instantes.'
    : 'Não foi possível enviar o acesso agora. Tente novamente em instantes.'
}

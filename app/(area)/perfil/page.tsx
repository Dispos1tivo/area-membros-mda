import type { Metadata } from 'next'
import { getAluno } from '@/lib/aluno'
import { salvarNome, salvarSenha } from './actions'

export const metadata: Metadata = { title: 'Minha conta' }

const AVISOS_SENHA: Record<string, { ok: boolean; texto: string }> = {
  salva: { ok: true, texto: 'Senha salva. No próximo acesso, você já pode entrar com e-mail e senha.' },
  criar: { ok: true, texto: 'Você entrou com o código. Agora defina sua senha abaixo.' },
  tamanho: { ok: false, texto: 'A senha precisa ter entre 8 e 72 caracteres.' },
  diferente: { ok: false, texto: 'As duas senhas não são iguais. Digite de novo.' },
  igual: { ok: false, texto: 'A nova senha precisa ser diferente da atual.' },
  fraca: { ok: false, texto: 'Essa senha é fraca demais. Tente uma mais longa, misturando letras e números.' },
  reentrar: { ok: false, texto: 'Por segurança, saia e entre de novo com o código por e-mail antes de trocar a senha.' },
  erro: { ok: false, texto: 'Não foi possível salvar a senha. Tente novamente.' },
}

export default async function Perfil({ searchParams }: { searchParams: Promise<{ status?: string; senha?: string }> }) {
  const aluno = await getAluno()
  const { status, senha } = await searchParams
  const avisoSenha = senha ? AVISOS_SENHA[senha] : undefined
  const trocar = aluno.temSenha || aluno.comSenhaInicial

  return (
    <>
      <section className="saudacao">
        <h1>Minha conta</h1>
        <p>Seus dados de acesso à área de membros.</p>
      </section>

      <section className="card">
        <form action={salvarNome} className="form-perfil">
          {status === 'salvo' && <p className="aviso aviso-ok">Dados salvos.</p>}
          {status === 'erro' && <p className="aviso aviso-erro">Não foi possível salvar. Tente novamente.</p>}

          <div className="campo">
            <label htmlFor="nome">Como você quer ser chamado(a)</label>
            <input id="nome" name="nome" className="input" maxLength={80} defaultValue={aluno.nome ?? ''} placeholder="Seu nome" />
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail de acesso</label>
            <input id="email" className="input" value={aluno.email} disabled readOnly />
          </div>

          <button className="btn btn-ouro">Salvar</button>
        </form>
      </section>

      <section className="card" id="senha">
        <form action={salvarSenha} className="form-perfil">
          <div>
            <h2 className="card-titulo">{trocar ? 'Trocar senha' : 'Criar senha'}</h2>
            <p className="card-sub">
              {aluno.temSenha
                ? 'Sua conta já tem senha. Para trocar, digite a nova abaixo.'
                : aluno.comSenhaInicial
                  ? 'Sua senha atual é a inicial: o CPF usado na compra. Troque por uma que só você conheça.'
                  : 'Com uma senha, você entra direto com e-mail e senha, sem esperar o código chegar no e-mail.'}
            </p>
          </div>

          {avisoSenha && <p className={`aviso ${avisoSenha.ok ? 'aviso-ok' : 'aviso-erro'}`}>{avisoSenha.texto}</p>}

          {/* Ajuda o gerenciador de senhas do navegador a guardar a senha junto com o e-mail certo. */}
          <input type="email" name="username" autoComplete="username" value={aluno.email} readOnly hidden />

          <div className="campo">
            <label htmlFor="senha-nova">Nova senha</label>
            <input
              id="senha-nova"
              name="senha"
              type="password"
              className="input"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
              placeholder="Mínimo de 8 caracteres"
            />
          </div>

          <div className="campo">
            <label htmlFor="senha-confirmacao">Repita a nova senha</label>
            <input
              id="senha-confirmacao"
              name="confirmacao"
              type="password"
              className="input"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          <button className="btn btn-ouro">{trocar ? 'Trocar senha' : 'Criar senha'}</button>
        </form>
      </section>
    </>
  )
}

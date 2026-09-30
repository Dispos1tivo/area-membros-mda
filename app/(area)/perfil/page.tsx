import type { Metadata } from 'next'
import { getAluno } from '@/lib/aluno'
import { salvarNome } from './actions'

export const metadata: Metadata = { title: 'Minha conta' }

export default async function Perfil({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const aluno = await getAluno()
  const { status } = await searchParams

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
    </>
  )
}

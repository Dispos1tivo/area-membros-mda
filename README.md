# Área de Membros · Método da Aprovação

Área de membros própria dos produtos do Método da Aprovação.

**Funil:** Anúncio → Página de vendas → Checkout (Cakto) → **Área de Membros** → Produtos

**Tecnologia:** Next.js (site) · Supabase (login + banco de dados) · Vercel (hospedagem)

**No ar:** <https://area-membros-mda.vercel.app>  (cada push na branch `main` publica automaticamente)

## O que já existe (estrutura)

| Tela / parte | Caminho | O que faz |
|---|---|---|
| Login | `/login` | Login sem senha: o aluno recebe **link + código** no e-mail |
| Confirmação do link | `/auth/confirm` | Valida o link do e-mail e entra na área |
| Sair | `/auth/sair` | Encerra a sessão |
| Meus produtos | `/painel` | Painel do aluno (produtos entram na próxima etapa) |
| Minha conta | `/perfil` | Nome e e-mail do aluno |
| Proteção | `middleware.ts` | Quem não está logado é mandado para o login |
| Banco | `supabase/migrations/` | Tabela `perfis` com segurança por aluno (RLS) |

Só entra quem **já é aluno**: a tela de login não cria conta. Hoje o aluno é cadastrado à mão no Supabase; depois, o webhook da Cakto fará isso na compra.

## Próximas etapas

1. Produtos e acessos (tabelas `produtos` e `acessos`, cards no painel)
2. Webhook da Cakto (compra aprovada → cria aluno e libera produto; reembolso → remove)
3. Conteúdo do Combo (PDFs com marca d'água, simulados interativos)
4. Aplicativos (em desenvolvimento, integração depois)
5. Domínio próprio

---

## Como configurar (passo a passo)

### 1. Supabase

1. Crie a conta em <https://supabase.com> (pode entrar com o GitHub).
2. **New project** → região **South America (São Paulo)** → guarde a senha do banco.
3. **SQL Editor → New query** → cole o conteúdo de `supabase/migrations/0001_estrutura_inicial.sql` → **Run**.
4. **Authentication → Sign In / Providers**:
   - **Email**: ativado.
   - **Allow new users to sign up**: **desativado** (ninguém se cadastra sozinho).
5. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` enquanto testamos. Depois do deploy, troque pelo endereço da Vercel.
   - **Redirect URLs**: adicione `http://localhost:3000/**` e, depois, `https://SEU-PROJETO.vercel.app/**`.
6. **Authentication → Emails → Templates → Magic Link**: cole o HTML de `supabase/templates/magic-link.html`.
7. **Criar um aluno de teste**: **Authentication → Users → Add user → Create new user** com o seu e-mail (marque *Auto Confirm User*).

> ⚠️ **E-mails para alunos de verdade:** o envio de e-mail padrão do Supabase só entrega para os e-mails da sua equipe no Supabase e tem limite baixo por hora. Serve para testar. Antes de abrir para alunos, configure um SMTP próprio (recomendado: [Resend](https://resend.com), plano grátis de 3.000 e-mails/mês) em **Authentication → Emails → SMTP Settings**.

### 2. Rodar no seu computador

Precisa do [Node.js LTS](https://nodejs.org) instalado.

```bash
npm install
cp .env.example .env.local   # e preencha com os dados do Supabase (Project Settings → API)
npm run dev
```

Abra <http://localhost:3000>.

### 3. Publicar na Vercel

1. Suba esta pasta para um repositório **privado** no GitHub.
2. Na Vercel: **Add New → Project** → importe o repositório.
3. Em **Environment Variables**, adicione as mesmas variáveis do `.env.local`.
4. **Deploy**. Depois atualize a *Site URL* e as *Redirect URLs* no Supabase com o endereço gerado.

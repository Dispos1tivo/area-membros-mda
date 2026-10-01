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

## Webhook da Cakto

Endereço: `https://area-membros-mda.vercel.app/api/webhooks/cakto`

| Evento | O que a área faz |
|---|---|
| `purchase_approved` | Cria o aluno (se for novo) e libera o produto |
| `refund`, `chargeback` | Revoga o acesso ao produto |
| outros | Só registra |

- Cada aviso fica registrado na tabela `cakto_eventos` (coluna `resultado` diz o que aconteceu).
- O produto é reconhecido pelo id do produto na Cakto (`produtos.cakto_produto_id`) ou, na primeira venda, pela oferta do `checkout_url` — e o id é gravado sozinho.
- Variáveis na Vercel: `SUPABASE_SECRET_KEY` e `CAKTO_WEBHOOK_SECRET` (ver `.env.example`).

## Próximas etapas

1. Domínio próprio + SMTP (Resend): e-mail de acesso com a marca e código de 6 dígitos — obrigatório antes de alunos reais
2. Marca d'água nos PDFs, simulados interativos
3. Aplicativos (em desenvolvimento, integração depois)

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

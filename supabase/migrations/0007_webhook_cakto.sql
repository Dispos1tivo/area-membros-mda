-- =====================================================================
-- Área de Membros MDA — registro dos avisos (webhooks) da Cakto
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
-- =====================================================================

-- Um registro por aviso recebido: serve para conferir o que aconteceu com
-- cada venda (liberou? produto desconhecido? erro?). Não guarda CPF,
-- telefone nem dados de cartão.
create table public.cakto_eventos (
  id               uuid primary key default gen_random_uuid(),
  recebido_em      timestamptz not null default now(),
  evento           text not null,               -- purchase_approved, refund, chargeback...
  resultado        text not null,               -- acesso_liberado, acesso_revogado, produto_desconhecido, ignorado, erro...
  pedido_id        text,                        -- data.id da Cakto
  ref_id           text,                        -- código curto do pedido (data.refId)
  email            text,
  produto_cakto_id text,
  produto_nome     text,
  oferta_id        text,
  detalhe          text
);

create index on public.cakto_eventos (recebido_em desc);

-- Só o servidor acessa (nenhuma política para alunos)
alter table public.cakto_eventos enable row level security;
revoke all on public.cakto_eventos from anon, authenticated;
grant all on public.cakto_eventos to service_role;

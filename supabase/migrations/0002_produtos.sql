-- =====================================================================
-- Área de Membros MDA — produtos, acessos e materiais
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
-- =====================================================================

-- Catálogo de produtos (todos os alunos veem; quem não tem, vê bloqueado)
create table public.produtos (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,          -- usado no endereço: /produtos/<slug>
  nome             text not null,
  etiqueta         text,                           -- selo no card, ex.: "PMMG 2027"
  descricao        text,
  checkout_url     text,                           -- link da Cakto para quem ainda não tem
  cakto_produto_id text unique,                    -- usado pelo webhook (etapa futura)
  ordem            int not null default 0,
  ativo            boolean not null default true,
  criado_em        timestamptz not null default now()
);

-- Quem tem acesso a quê (hoje manual; depois, criado pelo webhook da Cakto)
create table public.acessos (
  aluno_id     uuid not null references public.perfis (id) on delete cascade,
  produto_id   uuid not null references public.produtos (id) on delete cascade,
  origem       text not null default 'manual',     -- 'manual' | 'cakto'
  pedido_id    text,                               -- id do pedido na Cakto
  liberado_em  timestamptz not null default now(),
  revogado_em  timestamptz,                        -- preenchido em reembolso/chargeback
  primary key (aluno_id, produto_id)
);

-- Arquivos de cada produto (ficam no bucket privado "materiais")
create table public.materiais (
  id          uuid primary key default gen_random_uuid(),
  produto_id  uuid not null references public.produtos (id) on delete cascade,
  secao       text not null default 'Materiais',   -- ex.: Apostilas, Simulados, Bônus
  titulo      text not null,
  descricao   text,
  arquivo     text not null,                       -- caminho no bucket, ex.: pmmg-2027/apostila-1.pdf
  ordem       int not null default 0,
  criado_em   timestamptz not null default now()
);

create index on public.materiais (produto_id, ordem);

alter table public.produtos  enable row level security;
alter table public.acessos   enable row level security;
alter table public.materiais enable row level security;

create policy "aluno ve produtos ativos"
  on public.produtos for select to authenticated
  using (ativo);

create policy "aluno ve os proprios acessos"
  on public.acessos for select to authenticated
  using ((select auth.uid()) = aluno_id);

create policy "aluno ve materiais dos produtos liberados"
  on public.materiais for select to authenticated
  using (exists (
    select 1 from public.acessos a
    where a.produto_id = materiais.produto_id
      and a.aluno_id = (select auth.uid())
      and a.revogado_em is null
  ));

-- Permissões explícitas: aluno só lê; servidor (webhook) tem acesso total
revoke all on public.produtos, public.acessos, public.materiais from anon, authenticated;
grant select on public.produtos, public.acessos, public.materiais to authenticated;
grant all on public.produtos, public.acessos, public.materiais to service_role;

-- ---------------------------------------------------------------------
-- Armazenamento privado dos PDFs
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('materiais', 'materiais', false)
on conflict (id) do nothing;

-- Só baixa o arquivo quem tem acesso ao produto dele
create policy "aluno baixa material liberado"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'materiais'
    and exists (
      select 1
      from public.materiais m
      join public.acessos a on a.produto_id = m.produto_id
      where m.arquivo = storage.objects.name
        and a.aluno_id = (select auth.uid())
        and a.revogado_em is null
    )
  );

-- ---------------------------------------------------------------------
-- Primeiro produto
-- ---------------------------------------------------------------------
insert into public.produtos (slug, nome, etiqueta, descricao, ordem)
values (
  'combo-pmmg-2027',
  'Combo da Aprovação PMMG 2027',
  'PMMG 2027',
  'Todo o material da sua preparação para o concurso da PMMG 2027 em um só lugar.',
  1
);

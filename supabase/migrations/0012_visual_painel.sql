-- =====================================================================
-- Área de Membros MDA — dados para o novo visual do painel
-- (capa por concurso, selos do card, contagem para a prova e
--  "continuar de onde parou")
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
-- =====================================================================

alter table public.produtos
  add column concurso   text,                          -- filtro e capa, ex.: "PMMG"
  add column tipo       text not null default 'combo', -- 'combo' | 'mapas' (muda o desenho da capa)
  add column destaques  text[] not null default '{}',  -- selos do card, ex.: {"5 apostilas","5 simulados"}
  add column data_prova date;                          -- contagem regressiva (vazio = sem data marcada)

update public.produtos set
  concurso = 'PMMG', tipo = 'combo',
  destaques = '{"5 apostilas","5 simulados","5 bônus"}'
where slug = 'combo-pmmg-2027';

update public.produtos set
  concurso = 'PMPE', tipo = 'combo',
  destaques = '{"5 apostilas","5 simulados","5 bônus"}',
  data_prova = '2027-02-21'
where slug = 'combo-pmpe-2026';

update public.produtos set
  concurso = 'PMMG', tipo = 'mapas',
  destaques = '{"51 mapas mentais","3 matérias"}'
where slug = 'mapas-mentais-pmmg-2027';

update public.produtos set
  concurso = 'PMPE', tipo = 'mapas',
  destaques = '{"48 mapas mentais","4 mapas gerais"}',
  data_prova = '2027-02-21'
where slug = 'mapas-mentais-pmpe-2026';

-- ---------------------------------------------------------------------
-- O que cada aluno já abriu (uma linha por material; guarda a última vez)
-- ---------------------------------------------------------------------
create table public.materiais_abertos (
  aluno_id    uuid not null references public.perfis (id) on delete cascade,
  material_id uuid not null references public.materiais (id) on delete cascade,
  aberto_em   timestamptz not null default now(),
  primary key (aluno_id, material_id)
);

create index on public.materiais_abertos (aluno_id, aberto_em desc);

alter table public.materiais_abertos enable row level security;

create policy "aluno ve o que abriu"
  on public.materiais_abertos for select to authenticated
  using ((select auth.uid()) = aluno_id);

-- Só registra material que o aluno enxerga (ou seja, de produto liberado)
create policy "aluno registra o que abriu"
  on public.materiais_abertos for insert to authenticated
  with check (
    (select auth.uid()) = aluno_id
    and exists (select 1 from public.materiais m where m.id = material_id)
  );

create policy "aluno atualiza o que abriu"
  on public.materiais_abertos for update to authenticated
  using ((select auth.uid()) = aluno_id)
  with check ((select auth.uid()) = aluno_id);

revoke all on public.materiais_abertos from anon, authenticated;
grant select, insert, update on public.materiais_abertos to authenticated;
grant all on public.materiais_abertos to service_role;

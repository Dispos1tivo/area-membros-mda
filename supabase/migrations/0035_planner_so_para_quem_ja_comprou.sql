-- 2026-11-26: o Planner de 30 Dias deixou de ser bônus do Combo.
-- Quem já tinha comprado (primeira liberação antes de 27/11/2026 00:00 de Brasília) continua vendo;
-- quem comprar depois não vê nem consegue baixar o PDF.
-- Os outros bônus passam a ser 1 a 4.

-- 1. Data da PRIMEIRA liberação do acesso. O webhook da Cakto faz upsert só com
--    liberado_em/revogado_em, então esta coluna não muda em recompra nem em reenvio do webhook.
alter table public.acessos add column if not exists primeiro_liberado_em timestamptz not null default now();
update public.acessos set primeiro_liberado_em = liberado_em where primeiro_liberado_em > liberado_em;

-- 2. Material que só vale para quem recebeu o acesso antes de uma data (null = todos).
alter table public.materiais add column if not exists so_ate timestamptz;

-- 3. Regras de leitura: lista de materiais e download do arquivo.
drop policy if exists "aluno ve materiais dos produtos liberados" on public.materiais;
create policy "aluno ve materiais dos produtos liberados" on public.materiais
  for select to authenticated
  using (exists (
    select 1 from public.acessos a
    where a.produto_id = materiais.produto_id
      and a.aluno_id = (select auth.uid())
      and a.revogado_em is null
      and (materiais.so_ate is null or a.primeiro_liberado_em < materiais.so_ate)
  ));

drop policy if exists "aluno baixa material liberado" on storage.objects;
create policy "aluno baixa material liberado" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'materiais' and exists (
      select 1 from public.materiais m
      join public.acessos a on a.produto_id = m.produto_id
      where m.arquivo = objects.name
        and a.aluno_id = (select auth.uid())
        and a.revogado_em is null
        and (m.so_ate is null or a.primeiro_liberado_em < m.so_ate)
    )
  );

-- 4. Planner: sem número, depois do TAF, só para quem já tinha comprado.
update public.materiais
set titulo = 'Planner de 30 Dias (bônus de compras anteriores)',
    ordem = 30,
    so_ate = '2026-11-27 00:00:00-03'
where titulo = 'Bônus 2 · Planner de 30 Dias';

-- 5. Renumera os outros bônus.
update public.materiais set titulo = replace(titulo, 'Bônus 3 · ', 'Bônus 2 · ') where titulo like 'Bônus 3 · Planejamento de Estudos%';
update public.materiais set titulo = replace(titulo, 'Bônus 4 · ', 'Bônus 3 · ') where titulo like 'Bônus 4 · Prompts da Aprovação%';
update public.materiais set titulo = replace(titulo, 'Bônus 5 · ', 'Bônus 4 · ') where titulo like 'Bônus 5 · Plano de Treino para o TAF%';

-- 6. Descrição dos Combos: 5 bônus -> 4 bônus.
update public.produtos set descricao = replace(descricao, ' e 5 bônus', ' e 4 bônus') where descricao like '% e 5 bônus%';

-- 7. Selos dos cartões dos Combos: "5 bônus" -> "4 bônus".
update public.produtos set destaques = array_replace(destaques, '5 bônus', '4 bônus') where '5 bônus' = any(destaques);

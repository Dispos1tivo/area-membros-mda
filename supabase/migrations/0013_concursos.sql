-- =====================================================================
-- Área de Membros MDA — concursos (filtro por estado e radar de editais)
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
--
-- Para atualizar um edital depois, basta editar a linha do concurso
-- (Table Editor > concursos) e trocar a data em "atualizado_em".
-- =====================================================================

create table public.concursos (
  id               uuid primary key default gen_random_uuid(),
  sigla            text not null unique,              -- "PMMG" (também escolhe o brasão e a cor da capa)
  orgao            text not null,                     -- "Polícia Militar de Minas Gerais"
  cargo            text,                              -- "Soldado"
  uf               text not null,                     -- "MG"
  estado           text not null,                     -- "Minas Gerais" (nome no filtro)
  situacao         text not null default 'previsto'
                   check (situacao in ('aberto', 'previsto', 'anunciado')),
  vagas            text,                              -- "1.250" (vazio = "A definir")
  banca            text,                              -- vazio = "A definir"
  previsao         text,                              -- sem edital ainda: "Previsto para 2027"
  inscricoes_inicio date,
  inscricoes_fim   date,
  data_prova       date,
  fonte_url        text,                              -- site oficial do edital/banca
  pagina_url       text,                              -- página de vendas do material
  ordem            int not null default 0,
  ativo            boolean not null default true,
  atualizado_em    date not null default current_date -- aparece no cartão: "Atualizado em"
);

alter table public.concursos enable row level security;

create policy "aluno ve concursos ativos"
  on public.concursos for select to authenticated
  using (ativo);

revoke all on public.concursos from anon, authenticated;
grant select on public.concursos to authenticated;
grant all on public.concursos to service_role;

insert into public.concursos
  (sigla, orgao, cargo, uf, estado, situacao, vagas, banca, previsao, inscricoes_inicio, inscricoes_fim, data_prova, fonte_url, pagina_url, ordem)
values
  ('PMPE', 'Polícia Militar de Pernambuco', 'Soldado', 'PE', 'Pernambuco', 'aberto',
   '1.250', 'Instituto AOCP', null, '2026-10-05', '2026-11-05', '2027-02-21',
   'https://www.institutoaocp.org.br/', 'https://pmpe.mdaconcursos.com.br', 1),
  ('PMMG', 'Polícia Militar de Minas Gerais', 'Soldado', 'MG', 'Minas Gerais', 'previsto',
   null, 'CRS', 'Previsto para 2027', null, null, null,
   null, 'https://pmmg.mdaconcursos.com.br', 2),
  ('PCMG', 'Polícia Civil de Minas Gerais', 'Investigador', 'MG', 'Minas Gerais', 'anunciado',
   '3 mil anunciadas', null, 'Esperado ainda em 2026', null, null, null,
   null, 'https://pcmg.mdaconcursos.com.br', 3);

-- Cada produto passa a apontar para o seu concurso
-- (a sigla e a data da prova saem do produto e ficam só no concurso)
alter table public.produtos add column concurso_id uuid references public.concursos (id);

update public.produtos p
set concurso_id = c.id
from public.concursos c
where c.sigla = p.concurso;

alter table public.produtos drop column concurso, drop column data_prova;

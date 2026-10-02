-- =====================================================================
-- Order bump: Combo de Mapas Mentais PMPE 2026 — produto e materiais
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
-- Os PDFs vão no bucket "materiais", pasta "mapas-pmpe-2026".
-- (pode rodar mais de uma vez sem duplicar)
-- =====================================================================

insert into public.produtos (slug, nome, etiqueta, descricao, ordem)
values (
  'mapas-mentais-pmpe-2026',
  'Combo de Mapas Mentais PMPE 2026',
  'PMPE 2026',
  '48 mapas mentais das matérias do edital do Soldado PMPE, cada PDF com um mapa geral, para revisar o conteúdo.',
  4
)
on conflict (slug) do update
set nome = excluded.nome,
    etiqueta = excluded.etiqueta,
    descricao = excluded.descricao,
    ordem = excluded.ordem;

delete from public.materiais
where arquivo like 'mapas-pmpe-2026/%';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Mapas Mentais', 1, 'Língua Portuguesa',                           '10 mapas mentais + mapa geral', 'mapas-pmpe-2026/mapas-1.pdf'),
  ('Mapas Mentais', 2, 'Raciocínio Lógico e Informática',             '12 mapas mentais + mapa geral', 'mapas-pmpe-2026/mapas-2.pdf'),
  ('Mapas Mentais', 3, 'Direito Constitucional e História de PE',     '15 mapas mentais + mapa geral', 'mapas-pmpe-2026/mapas-3.pdf'),
  ('Mapas Mentais', 4, 'Direitos Humanos e Legislação Extravagante',  '11 mapas mentais + mapa geral', 'mapas-pmpe-2026/mapas-4.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'mapas-mentais-pmpe-2026';

-- =====================================================================
-- Order bump: Combo de Mapas Mentais PCMG 2027 — produto e materiais
-- Os PDFs vão no bucket "materiais", pasta "mapas-pcmg-2027".
-- (pode rodar mais de uma vez sem duplicar)
-- =====================================================================

insert into public.produtos
  (slug, nome, etiqueta, descricao, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'mapas-mentais-pcmg-2027',
  'Combo de Mapas Mentais PCMG 2027',
  'PCMG 2027',
  '25 mapas mentais das matérias do edital do Investigador PCMG, cada PDF com uma página do que mais decorar, para revisar o conteúdo.',
  '50edf696-297f-4464-a4f8-de639a6963f9',
  6,
  'mapas',
  '{"25 mapas mentais","8 matérias"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'PCMG'
on conflict (slug) do update
set nome = excluded.nome,
    etiqueta = excluded.etiqueta,
    descricao = excluded.descricao,
    cakto_produto_id = excluded.cakto_produto_id,
    ordem = excluded.ordem,
    tipo = excluded.tipo,
    destaques = excluded.destaques,
    concurso_id = excluded.concurso_id;

delete from public.materiais
where arquivo like 'mapas-pcmg-2027/%';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Mapas Mentais', 1, 'Língua Portuguesa',                               '3 mapas mentais + o que mais decorar', 'mapas-pcmg-2027/mapas-1.pdf'),
  ('Mapas Mentais', 2, 'Raciocínio Lógico-Matemático',                    '2 mapas mentais + o que mais decorar', 'mapas-pcmg-2027/mapas-2.pdf'),
  ('Mapas Mentais', 3, 'Informática Básica',                              '3 mapas mentais + o que mais decorar', 'mapas-pcmg-2027/mapas-3.pdf'),
  ('Mapas Mentais', 4, 'Lei Orgânica da PCMG',                            '3 mapas mentais + o que mais decorar', 'mapas-pcmg-2027/mapas-4.pdf'),
  ('Mapas Mentais', 5, 'Direito Constitucional e Administrativo',         '4 mapas mentais + o que mais decorar', 'mapas-pcmg-2027/mapas-5.pdf'),
  ('Mapas Mentais', 6, 'Direito Penal e Processo Penal',                  '4 mapas mentais + o que mais decorar', 'mapas-pcmg-2027/mapas-6.pdf'),
  ('Mapas Mentais', 7, 'Legislação Penal e Processual Extravagante',      '3 mapas mentais + o que mais decorar', 'mapas-pcmg-2027/mapas-7.pdf'),
  ('Mapas Mentais', 8, 'Direitos Humanos, Medicina Legal e Criminologia', '3 mapas mentais + o que mais decorar', 'mapas-pcmg-2027/mapas-8.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'mapas-mentais-pcmg-2027';

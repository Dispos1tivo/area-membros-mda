-- =====================================================================
-- PMESP (Polícia Militar do Estado de São Paulo, Aluno-Soldado PM) — 13/11/2026
-- Concurso no radar + Combo da Aprovação PMESP 2027 + Combo de Mapas Mentais PMESP 2027.
-- PDFs no bucket "materiais", pastas nova-marca/pmesp-2027 e nova-marca/mapas-pmesp-2027
-- (já com a marca MDA Concursos). Pode rodar mais de uma vez sem duplicar.
-- =====================================================================

-- Concurso (edital DP-4/321/26, DOESP de 05/11/2026, banca Vunesp)
insert into public.concursos
  (sigla, orgao, cargo, uf, estado, situacao, vagas, banca, previsao,
   inscricoes_inicio, inscricoes_fim, data_prova, fonte_url, pagina_url, ordem, atualizado_em)
values
  ('PMESP', 'Polícia Militar do Estado de São Paulo', 'Soldado', 'SP', 'São Paulo', 'aberto',
   '2.000', 'Vunesp', null,
   '2026-11-09', '2026-12-22', '2027-02-28',
   'https://www.vunesp.com.br/PMES2603', 'https://pmesp.mdaconcursos.com.br', 4, '2026-11-13')
on conflict (sigla) do update
set orgao = excluded.orgao, cargo = excluded.cargo, uf = excluded.uf, estado = excluded.estado,
    situacao = excluded.situacao, vagas = excluded.vagas, banca = excluded.banca, previsao = excluded.previsao,
    inscricoes_inicio = excluded.inscricoes_inicio, inscricoes_fim = excluded.inscricoes_fim,
    data_prova = excluded.data_prova, fonte_url = excluded.fonte_url, pagina_url = excluded.pagina_url,
    ordem = excluded.ordem, atualizado_em = excluded.atualizado_em;

-- Combo (Cakto: produto bd6c181e…, checkout xdb56zr_1321669)
insert into public.produtos
  (slug, nome, etiqueta, descricao, checkout_url, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'combo-pmesp-2027',
  'Combo da Aprovação PMESP 2027',
  'PMESP 2027',
  '8 apostilas com o edital completo, 5 simulados no padrão Vunesp com gabarito comentado e redação, e 5 bônus.',
  'https://pay.cakto.com.br/xdb56zr_1321669',
  'bd6c181e-cb31-4178-92b9-339b2b0fb7f5',
  7,
  'combo',
  '{"8 apostilas","5 simulados","5 bônus"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'PMESP'
on conflict (slug) do update
set nome = excluded.nome, etiqueta = excluded.etiqueta, descricao = excluded.descricao,
    checkout_url = excluded.checkout_url, cakto_produto_id = excluded.cakto_produto_id,
    ordem = excluded.ordem, tipo = excluded.tipo, destaques = excluded.destaques, concurso_id = excluded.concurso_id;

-- Mapas mentais, order bump de R$ 9,90 (Cakto: produto 7db95d3f…, checkout 7bzcnum_1321670)
insert into public.produtos
  (slug, nome, etiqueta, descricao, checkout_url, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'mapas-mentais-pmesp-2027',
  'Combo de Mapas Mentais PMESP 2027',
  'PMESP 2027',
  '25 mapas mentais das matérias do edital de Soldado PMESP, para revisar o conteúdo.',
  'https://pay.cakto.com.br/7bzcnum_1321670',
  '7db95d3f-c9a1-4c46-9618-81ebd742faa6',
  8,
  'mapas',
  '{"25 mapas mentais","5 matérias"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'PMESP'
on conflict (slug) do update
set nome = excluded.nome, etiqueta = excluded.etiqueta, descricao = excluded.descricao,
    checkout_url = excluded.checkout_url, cakto_produto_id = excluded.cakto_produto_id,
    ordem = excluded.ordem, tipo = excluded.tipo, destaques = excluded.destaques, concurso_id = excluded.concurso_id;

-- Materiais (títulos dos bônus iguais aos da página de vendas)
delete from public.materiais
where arquivo like 'nova-marca/pmesp-2027/%' or arquivo like 'nova-marca/mapas-pmesp-2027/%';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Apostilas',  1, 'Língua Portuguesa',               'Apostila 1 · Conteúdo completo do edital da PMESP', 'nova-marca/pmesp-2027/apostila-1.pdf'),
  ('Apostilas',  2, 'Matemática',                      'Apostila 2 · Conteúdo completo do edital da PMESP', 'nova-marca/pmesp-2027/apostila-2.pdf'),
  ('Apostilas',  3, 'História Geral e do Brasil',      'Apostila 3 · Conteúdo completo do edital da PMESP', 'nova-marca/pmesp-2027/apostila-3.pdf'),
  ('Apostilas',  4, 'Geografia Geral e do Brasil',     'Apostila 4 · Conteúdo completo do edital da PMESP', 'nova-marca/pmesp-2027/apostila-4.pdf'),
  ('Apostilas',  5, 'Atualidades',                     'Apostila 5 · Conteúdo completo do edital da PMESP', 'nova-marca/pmesp-2027/apostila-5.pdf'),
  ('Apostilas',  6, 'Noções Básicas de Informática',   'Apostila 6 · Conteúdo completo do edital da PMESP', 'nova-marca/pmesp-2027/apostila-6.pdf'),
  ('Apostilas',  7, 'Noções de Administração Pública', 'Apostila 7 · Conteúdo completo do edital da PMESP', 'nova-marca/pmesp-2027/apostila-7.pdf'),
  ('Apostilas',  8, 'Redação',                         'Apostila 8 · Conteúdo completo do edital da PMESP', 'nova-marca/pmesp-2027/apostila-8.pdf'),
  ('Simulados', 11, 'Simulado 1', '60 questões e redação no padrão Vunesp, com gabarito comentado', 'nova-marca/pmesp-2027/simulado-1.pdf'),
  ('Simulados', 12, 'Simulado 2', '60 questões e redação no padrão Vunesp, com gabarito comentado', 'nova-marca/pmesp-2027/simulado-2.pdf'),
  ('Simulados', 13, 'Simulado 3', '60 questões e redação no padrão Vunesp, com gabarito comentado', 'nova-marca/pmesp-2027/simulado-3.pdf'),
  ('Simulados', 14, 'Simulado 4', '60 questões e redação no padrão Vunesp, com gabarito comentado', 'nova-marca/pmesp-2027/simulado-4.pdf'),
  ('Simulados', 15, 'Simulado 5', '60 questões e redação no padrão Vunesp, com gabarito comentado', 'nova-marca/pmesp-2027/simulado-5.pdf'),
  ('Bônus', 21, 'Bônus 1 · Edital Verticalizado',       'As 5 matérias e a redação destrinchadas em 82 tópicos',           'nova-marca/pmesp-2027/bonus-1.pdf'),
  ('Bônus', 22, 'Bônus 2 · Planner de 30 Dias',         'Planner de 30 dias para acompanhar estudos e acertos',          'nova-marca/pmesp-2027/bonus-2.pdf'),
  ('Bônus', 23, 'Bônus 3 · Planejamento de Estudos',    'Cronograma semanal: sua semana de estudos já montada',          'nova-marca/pmesp-2027/bonus-3.pdf'),
  ('Bônus', 24, 'Bônus 4 · Prompts da Aprovação',       '45 comandos prontos para estudar com IA',                       'nova-marca/pmesp-2027/bonus-4.pdf'),
  ('Bônus', 25, 'Bônus 5 · Plano de Treino para o TAF', 'Treino masculino e feminino para os 4 testes do edital da PMESP', 'nova-marca/pmesp-2027/bonus-5.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-pmesp-2027';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Mapas Mentais', 1, 'Língua Portuguesa',                                     '5 mapas mentais', 'nova-marca/mapas-pmesp-2027/mapas-1.pdf'),
  ('Mapas Mentais', 2, 'Matemática',                                            '5 mapas mentais', 'nova-marca/mapas-pmesp-2027/mapas-2.pdf'),
  ('Mapas Mentais', 3, 'Conhecimentos Gerais (História, Geografia e Atualidades)', '8 mapas mentais', 'nova-marca/mapas-pmesp-2027/mapas-3.pdf'),
  ('Mapas Mentais', 4, 'Noções Básicas de Informática',                         '3 mapas mentais', 'nova-marca/mapas-pmesp-2027/mapas-4.pdf'),
  ('Mapas Mentais', 5, 'Noções de Administração Pública',                       '4 mapas mentais', 'nova-marca/mapas-pmesp-2027/mapas-5.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'mapas-mentais-pmesp-2027';

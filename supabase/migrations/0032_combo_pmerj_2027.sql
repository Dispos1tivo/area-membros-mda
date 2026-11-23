-- =====================================================================
-- PMERJ (Polícia Militar do Estado do Rio de Janeiro, Soldado) — 22/11/2026
-- Concurso no radar + Combo da Aprovação PMERJ 2027 + Combo de Mapas Mentais PMERJ 2027.
-- Sem edital novo: o governo do RJ anunciou 2.000 vagas de Soldado, banca a definir.
-- O material segue o último edital (Edital de Abertura nº 001/2023-SEPM, banca IBADE).
-- PDFs no bucket "materiais", pastas nova-marca/pmerj-2027 e nova-marca/mapas-pmerj-2027
-- (conferidos em 22/11: nenhum tem texto de outro concurso). Pode rodar mais de uma vez sem duplicar.
-- =====================================================================

insert into public.concursos
  (sigla, orgao, cargo, uf, estado, situacao, vagas, banca, previsao,
   inscricoes_inicio, inscricoes_fim, data_prova, fonte_url, pagina_url, ordem, atualizado_em)
values
  ('PMERJ', 'Polícia Militar do Estado do Rio de Janeiro', 'Soldado', 'RJ', 'Rio de Janeiro', 'anunciado',
   '2.000 anunciadas', null, 'Edital previsto pelo governo do RJ',
   null, null, null,
   'https://conhecimento.fgv.br/concursos/pmerj24/soldados', 'https://pmerj.mdaconcursos.com.br', 6, '2026-11-22')
on conflict (sigla) do update
set orgao = excluded.orgao, cargo = excluded.cargo, uf = excluded.uf, estado = excluded.estado,
    situacao = excluded.situacao, vagas = excluded.vagas, banca = excluded.banca, previsao = excluded.previsao,
    inscricoes_inicio = excluded.inscricoes_inicio, inscricoes_fim = excluded.inscricoes_fim,
    data_prova = excluded.data_prova, fonte_url = excluded.fonte_url, pagina_url = excluded.pagina_url,
    ordem = excluded.ordem, atualizado_em = excluded.atualizado_em;

-- Combo (Cakto: produto 6c62c55c…, checkout 34etjxs)
insert into public.produtos
  (slug, nome, etiqueta, descricao, checkout_url, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'combo-pmerj-2027',
  'Combo da Aprovação PMERJ 2027',
  'PMERJ 2027',
  '8 apostilas com a teoria do edital e a redação, 5 simulados de 50 questões no padrão IBADE com redação e gabarito comentado, e 5 bônus.',
  'https://pay.cakto.com.br/34etjxs',
  '6c62c55c-515e-4062-a0ca-5aa90c563d8a',
  11,
  'combo',
  '{"8 apostilas","5 simulados","5 bônus"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'PMERJ'
on conflict (slug) do update
set nome = excluded.nome, etiqueta = excluded.etiqueta, descricao = excluded.descricao,
    checkout_url = excluded.checkout_url, cakto_produto_id = excluded.cakto_produto_id,
    ordem = excluded.ordem, tipo = excluded.tipo, destaques = excluded.destaques, concurso_id = excluded.concurso_id;

-- Mapas mentais, order bump de R$ 9,90 (Cakto: produto 5c329e06…, checkout 32nyaha)
insert into public.produtos
  (slug, nome, etiqueta, descricao, checkout_url, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'mapas-mentais-pmerj-2027',
  'Combo de Mapas Mentais PMERJ 2027',
  'PMERJ 2027',
  '64 mapas mentais das matérias do edital de Soldado da PMERJ e da redação, para revisar o conteúdo.',
  'https://pay.cakto.com.br/32nyaha',
  '5c329e06-7f56-444e-9c12-a0e60391c339',
  12,
  'mapas',
  '{"64 mapas mentais","8 PDFs"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'PMERJ'
on conflict (slug) do update
set nome = excluded.nome, etiqueta = excluded.etiqueta, descricao = excluded.descricao,
    checkout_url = excluded.checkout_url, cakto_produto_id = excluded.cakto_produto_id,
    ordem = excluded.ordem, tipo = excluded.tipo, destaques = excluded.destaques, concurso_id = excluded.concurso_id;

-- Materiais (números das apostilas iguais aos das capas dos PDFs; bônus com os nomes da página de vendas)
delete from public.materiais
where arquivo like 'nova-marca/pmerj-2027/%' or arquivo like 'nova-marca/mapas-pmerj-2027/%';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Apostilas',  1, 'Língua Portuguesa',                'Apostila 1 · Teoria do edital da PMERJ no estilo IBADE', 'nova-marca/pmerj-2027/apostila-1.pdf'),
  ('Apostilas',  2, 'Matemática Básica',                'Apostila 2 · Teoria do edital da PMERJ no estilo IBADE', 'nova-marca/pmerj-2027/apostila-2.pdf'),
  ('Apostilas',  3, 'Noções de Direitos Humanos',       'Apostila 3 · Teoria do edital da PMERJ no estilo IBADE', 'nova-marca/pmerj-2027/apostila-3.pdf'),
  ('Apostilas',  4, 'Noções de Direito Administrativo', 'Apostila 4 · Teoria do edital da PMERJ no estilo IBADE', 'nova-marca/pmerj-2027/apostila-4.pdf'),
  ('Apostilas',  5, 'Legislação Aplicada à PMERJ',      'Apostila 5 · Teoria do edital da PMERJ no estilo IBADE', 'nova-marca/pmerj-2027/apostila-5.pdf'),
  ('Apostilas',  6, 'Direito Penal e Processual Penal', 'Apostila 6 · Teoria do edital da PMERJ no estilo IBADE', 'nova-marca/pmerj-2027/apostila-6.pdf'),
  ('Apostilas',  7, 'Legislação Penal Especial',        'Apostila 7 · Teoria do edital da PMERJ no estilo IBADE', 'nova-marca/pmerj-2027/apostila-7.pdf'),
  ('Apostilas',  8, 'Redação',                          'Apostila 8 · Texto dissertativo de 25 a 30 linhas',      'nova-marca/pmerj-2027/apostila-8.pdf'),
  ('Simulados', 11, 'Simulado 1', '50 questões no padrão IBADE, com redação e gabarito comentado', 'nova-marca/pmerj-2027/simulado-1.pdf'),
  ('Simulados', 12, 'Simulado 2', '50 questões no padrão IBADE, com redação e gabarito comentado', 'nova-marca/pmerj-2027/simulado-2.pdf'),
  ('Simulados', 13, 'Simulado 3', '50 questões no padrão IBADE, com redação e gabarito comentado', 'nova-marca/pmerj-2027/simulado-3.pdf'),
  ('Simulados', 14, 'Simulado 4', '50 questões no padrão IBADE, com redação e gabarito comentado', 'nova-marca/pmerj-2027/simulado-4.pdf'),
  ('Simulados', 15, 'Simulado 5', '50 questões no padrão IBADE, com redação e gabarito comentado', 'nova-marca/pmerj-2027/simulado-5.pdf'),
  ('Bônus', 21, 'Bônus 1 · Edital Verticalizado',       'As 5 matérias e a redação destrinchadas em 196 tópicos',            'nova-marca/pmerj-2027/bonus-1.pdf'),
  ('Bônus', 22, 'Bônus 2 · Planner de 30 Dias',         'Planner de 30 dias para acompanhar estudos e acertos',              'nova-marca/pmerj-2027/bonus-2.pdf'),
  ('Bônus', 23, 'Bônus 3 · Planejamento de Estudos',    'Cronograma semanal: sua semana de estudos já montada',              'nova-marca/pmerj-2027/bonus-3.pdf'),
  ('Bônus', 24, 'Bônus 4 · Prompts da Aprovação',       '52 comandos prontos para estudar com IA',                           'nova-marca/pmerj-2027/bonus-4.pdf'),
  ('Bônus', 25, 'Bônus 5 · Plano de Treino para o TAF', 'Treino masculino e feminino para os 3 testes do TAF da PMERJ',      'nova-marca/pmerj-2027/bonus-5.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-pmerj-2027';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Mapas Mentais', 1, 'Língua Portuguesa',                '8 mapas mentais', 'nova-marca/mapas-pmerj-2027/mapas-1.pdf'),
  ('Mapas Mentais', 2, 'Matemática Básica',                '8 mapas mentais', 'nova-marca/mapas-pmerj-2027/mapas-2.pdf'),
  ('Mapas Mentais', 3, 'Noções de Direitos Humanos',       '8 mapas mentais', 'nova-marca/mapas-pmerj-2027/mapas-3.pdf'),
  ('Mapas Mentais', 4, 'Noções de Direito Administrativo', '8 mapas mentais', 'nova-marca/mapas-pmerj-2027/mapas-4.pdf'),
  ('Mapas Mentais', 5, 'Legislação Aplicada à PMERJ',      '8 mapas mentais', 'nova-marca/mapas-pmerj-2027/mapas-5.pdf'),
  ('Mapas Mentais', 6, 'Direito Penal e Processual Penal', '8 mapas mentais', 'nova-marca/mapas-pmerj-2027/mapas-6.pdf'),
  ('Mapas Mentais', 7, 'Legislação Penal Especial',        '8 mapas mentais', 'nova-marca/mapas-pmerj-2027/mapas-7.pdf'),
  ('Mapas Mentais', 8, 'Redação',                          '8 mapas mentais', 'nova-marca/mapas-pmerj-2027/mapas-8.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'mapas-mentais-pmerj-2027';

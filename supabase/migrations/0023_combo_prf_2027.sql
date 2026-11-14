-- =====================================================================
-- PRF (Polícia Rodoviária Federal, Policial Rodoviário Federal) — 14/11/2026
-- Concurso no radar + Combo da Aprovação PRF 2027 + Combo de Mapas Mentais PRF 2027.
-- A PRF é federal: uf 'BR' e estado 'Federal' (vira o botão "Federal" no filtro por estado).
-- Sem edital novo: a PRF pediu 269 vagas de Policial e aguarda autorização. O material segue o
-- último edital (Edital nº 1/2021, Cebraspe).
-- PDFs no bucket "materiais", pastas nova-marca/prf-2027 e nova-marca/mapas-prf-2027
-- (bônus e mapas já sem o texto escondido da PCMG). Pode rodar mais de uma vez sem duplicar.
-- As apostilas 5 e 9 chegaram depois e entraram pela migration 0024.
-- =====================================================================

insert into public.concursos
  (sigla, orgao, cargo, uf, estado, situacao, vagas, banca, previsao,
   inscricoes_inicio, inscricoes_fim, data_prova, fonte_url, pagina_url, ordem, atualizado_em)
values
  ('PRF', 'Polícia Rodoviária Federal', 'Policial Rodoviário Federal', 'BR', 'Federal', 'previsto',
   '269 solicitadas', null, 'Aguarda autorização do governo',
   null, null, null,
   'https://www.cebraspe.org.br/concursos/prf_21', 'https://prf.mdaconcursos.com.br', 5, '2026-11-14')
on conflict (sigla) do update
set orgao = excluded.orgao, cargo = excluded.cargo, uf = excluded.uf, estado = excluded.estado,
    situacao = excluded.situacao, vagas = excluded.vagas, banca = excluded.banca, previsao = excluded.previsao,
    inscricoes_inicio = excluded.inscricoes_inicio, inscricoes_fim = excluded.inscricoes_fim,
    data_prova = excluded.data_prova, fonte_url = excluded.fonte_url, pagina_url = excluded.pagina_url,
    ordem = excluded.ordem, atualizado_em = excluded.atualizado_em;

-- Combo (Cakto: produto 42d791ee…, checkout 72hyssp)
insert into public.produtos
  (slug, nome, etiqueta, descricao, checkout_url, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'combo-prf-2027',
  'Combo da Aprovação PRF 2027',
  'PRF 2027',
  '8 apostilas com a teoria do edital, 5 simulados de 120 itens no padrão Cebraspe com gabarito comentado e 5 bônus.',
  'https://pay.cakto.com.br/72hyssp',
  '42d791ee-01e5-4d22-a5f5-83bdc8e05e81',
  9,
  'combo',
  '{"8 apostilas","5 simulados","5 bônus"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'PRF'
on conflict (slug) do update
set nome = excluded.nome, etiqueta = excluded.etiqueta, descricao = excluded.descricao,
    checkout_url = excluded.checkout_url, cakto_produto_id = excluded.cakto_produto_id,
    ordem = excluded.ordem, tipo = excluded.tipo, destaques = excluded.destaques, concurso_id = excluded.concurso_id;

-- Mapas mentais, order bump de R$ 9,90 (Cakto: produto 4d8b541c…, checkout okk4ib9)
insert into public.produtos
  (slug, nome, etiqueta, descricao, checkout_url, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'mapas-mentais-prf-2027',
  'Combo de Mapas Mentais PRF 2027',
  'PRF 2027',
  '42 mapas mentais das 14 matérias do edital de Policial Rodoviário Federal, para revisar o conteúdo.',
  'https://pay.cakto.com.br/okk4ib9',
  '4d8b541c-9d72-4f5d-a47e-252b40f3e2d1',
  10,
  'mapas',
  '{"42 mapas mentais","14 matérias"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'PRF'
on conflict (slug) do update
set nome = excluded.nome, etiqueta = excluded.etiqueta, descricao = excluded.descricao,
    checkout_url = excluded.checkout_url, cakto_produto_id = excluded.cakto_produto_id,
    ordem = excluded.ordem, tipo = excluded.tipo, destaques = excluded.destaques, concurso_id = excluded.concurso_id;

-- Materiais (números das apostilas iguais aos das capas dos PDFs; bônus com os nomes da página de vendas)
delete from public.materiais
where arquivo like 'nova-marca/prf-2027/%' or arquivo like 'nova-marca/mapas-prf-2027/%';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Apostilas',  1, 'Língua Portuguesa',                     'Apostila 1 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-1.pdf'),
  ('Apostilas',  2, 'Raciocínio Lógico-Matemático e Física', 'Apostila 2 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-2.pdf'),
  ('Apostilas',  3, 'Informática',                           'Apostila 3 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-3.pdf'),
  ('Apostilas',  4, 'Ética, Cidadania e Direitos Humanos',   'Apostila 4 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-4.pdf'),
  -- ('Apostilas',  5, 'Geopolítica e Língua Estrangeira',  'Apostila 5 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-5.pdf'),
  ('Apostilas',  6, 'Legislação de Trânsito',                'Apostila 6 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-6.pdf'),
  ('Apostilas',  7, 'Direito Constitucional',                'Apostila 7 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-7.pdf'),
  ('Apostilas',  8, 'Direito Administrativo',                'Apostila 8 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-8.pdf'),
  -- ('Apostilas',  9, 'Direito Penal e Processual Penal',  'Apostila 9 · Teoria do edital da PRF no estilo Cebraspe',  'nova-marca/prf-2027/apostila-9.pdf'),
  ('Apostilas', 10, 'Legislação Especial',                   'Apostila 10 · Teoria do edital da PRF no estilo Cebraspe', 'nova-marca/prf-2027/apostila-10.pdf'),
  ('Simulados', 11, 'Simulado 1', '120 itens de certo ou errado no padrão Cebraspe, com gabarito comentado', 'nova-marca/prf-2027/simulado-1.pdf'),
  ('Simulados', 12, 'Simulado 2', '120 itens de certo ou errado no padrão Cebraspe, com gabarito comentado', 'nova-marca/prf-2027/simulado-2.pdf'),
  ('Simulados', 13, 'Simulado 3', '120 itens de certo ou errado no padrão Cebraspe, com gabarito comentado', 'nova-marca/prf-2027/simulado-3.pdf'),
  ('Simulados', 14, 'Simulado 4', '120 itens de certo ou errado no padrão Cebraspe, com gabarito comentado', 'nova-marca/prf-2027/simulado-4.pdf'),
  ('Simulados', 15, 'Simulado 5', '120 itens de certo ou errado no padrão Cebraspe, com gabarito comentado', 'nova-marca/prf-2027/simulado-5.pdf'),
  ('Bônus', 21, 'Bônus 1 · Edital Verticalizado',       'As 14 matérias do edital destrinchadas em 242 tópicos',         'nova-marca/prf-2027/bonus-1.pdf'),
  ('Bônus', 22, 'Bônus 2 · Planner de 30 Dias',         'Planner de 30 dias para acompanhar estudos e acertos',          'nova-marca/prf-2027/bonus-2.pdf'),
  ('Bônus', 23, 'Bônus 3 · Planejamento de Estudos',    'Cronograma semanal: sua semana de estudos já montada',          'nova-marca/prf-2027/bonus-3.pdf'),
  ('Bônus', 24, 'Bônus 4 · Prompts da Aprovação',       '45 comandos prontos para estudar com IA',                       'nova-marca/prf-2027/bonus-4.pdf'),
  ('Bônus', 25, 'Bônus 5 · Plano de Treino para o TAF', 'Treino masculino e feminino para os 5 testes do TAF da PRF',    'nova-marca/prf-2027/bonus-5.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-prf-2027';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Mapas Mentais',  1, 'Língua Portuguesa',                     '6 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-1.pdf'),
  ('Mapas Mentais',  2, 'Raciocínio Lógico-Matemático e Física', '6 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-2.pdf'),
  ('Mapas Mentais',  3, 'Informática',                           '3 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-3.pdf'),
  ('Mapas Mentais',  4, 'Ética, Cidadania e Direitos Humanos',   '3 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-4.pdf'),
  ('Mapas Mentais',  5, 'Geopolítica e Língua Estrangeira',      '3 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-5.pdf'),
  ('Mapas Mentais',  6, 'Legislação de Trânsito',                '4 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-6.pdf'),
  ('Mapas Mentais',  7, 'Direito Constitucional',                '4 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-7.pdf'),
  ('Mapas Mentais',  8, 'Direito Administrativo',                '5 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-8.pdf'),
  ('Mapas Mentais',  9, 'Direito Penal e Processual Penal',      '5 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-9.pdf'),
  ('Mapas Mentais', 10, 'Legislação Especial',                   '3 mapas mentais', 'nova-marca/mapas-prf-2027/mapas-10.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'mapas-mentais-prf-2027';

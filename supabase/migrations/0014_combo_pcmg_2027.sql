-- =====================================================================
-- Combo da Aprovação PCMG 2027 (Investigador) — produto e lista de materiais
-- Os PDFs vão no bucket "materiais", pasta "pcmg-2027", com estes nomes.
-- (conteúdo e nomes dos bônus conforme a página de vendas em H:\MDA\PCMG PV)
-- =====================================================================

insert into public.produtos
  (slug, nome, etiqueta, descricao, checkout_url, cakto_produto_id, ordem, tipo, destaques, concurso_id)
select
  'combo-pcmg-2027',
  'Combo da Aprovação PCMG 2027',
  'PCMG 2027',
  '8 apostilas com o edital completo, 5 simulados no padrão FGV com gabarito comentado e 5 bônus.',
  'https://pay.cakto.com.br/ohscwig_1187746',
  '2dad0030-1900-456a-ad9b-e2e375c8fec6',
  5,
  'combo',
  '{"8 apostilas","5 simulados","5 bônus"}'::text[],
  c.id
from public.concursos c
where c.sigla = 'PCMG';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Apostilas',  1, 'Língua Portuguesa',                               'Apostila 1 · Conteúdo completo do edital da PCMG', 'pcmg-2027/apostila-1.pdf'),
  ('Apostilas',  2, 'Raciocínio Lógico-Matemático',                    'Apostila 2 · Conteúdo completo do edital da PCMG', 'pcmg-2027/apostila-2.pdf'),
  ('Apostilas',  3, 'Informática Básica',                              'Apostila 3 · Conteúdo completo do edital da PCMG', 'pcmg-2027/apostila-3.pdf'),
  ('Apostilas',  4, 'Lei Orgânica da PCMG',                            'Apostila 4 · Conteúdo completo do edital da PCMG', 'pcmg-2027/apostila-4.pdf'),
  ('Apostilas',  5, 'Direito Constitucional e Administrativo',         'Apostila 5 · Conteúdo completo do edital da PCMG', 'pcmg-2027/apostila-5.pdf'),
  ('Apostilas',  6, 'Direito Penal e Processo Penal',                  'Apostila 6 · Conteúdo completo do edital da PCMG', 'pcmg-2027/apostila-6.pdf'),
  ('Apostilas',  7, 'Legislação Penal e Processual Extravagante',      'Apostila 7 · Conteúdo completo do edital da PCMG', 'pcmg-2027/apostila-7.pdf'),
  ('Apostilas',  8, 'Direitos Humanos, Medicina Legal e Criminologia', 'Apostila 8 · Conteúdo completo do edital da PCMG', 'pcmg-2027/apostila-8.pdf'),
  ('Simulados', 11, 'Simulado 1', '70 questões no padrão FGV, com gabarito comentado', 'pcmg-2027/simulado-1.pdf'),
  ('Simulados', 12, 'Simulado 2', '70 questões no padrão FGV, com gabarito comentado', 'pcmg-2027/simulado-2.pdf'),
  ('Simulados', 13, 'Simulado 3', '70 questões no padrão FGV, com gabarito comentado', 'pcmg-2027/simulado-3.pdf'),
  ('Simulados', 14, 'Simulado 4', '70 questões no padrão FGV, com gabarito comentado', 'pcmg-2027/simulado-4.pdf'),
  ('Simulados', 15, 'Simulado 5', '70 questões no padrão FGV, com gabarito comentado', 'pcmg-2027/simulado-5.pdf'),
  ('Bônus', 21, 'Bônus 1 · Edital Verticalizado',       'As 12 matérias do Investigador PCMG destrinchadas em 178 tópicos',   'pcmg-2027/bonus-1.pdf'),
  ('Bônus', 22, 'Bônus 2 · Planner de 30 Dias',         'Planner de 30 dias para acompanhar estudos e acertos',               'pcmg-2027/bonus-2.pdf'),
  ('Bônus', 23, 'Bônus 3 · Planejamento de Estudos',    'Cronograma semanal: sua semana de estudos já montada',               'pcmg-2027/bonus-3.pdf'),
  ('Bônus', 24, 'Bônus 4 · Prompts da Aprovação',       '41 comandos prontos para estudar com IA',                            'pcmg-2027/bonus-4.pdf'),
  ('Bônus', 25, 'Bônus 5 · Plano de Treino para o TAF', 'Treino masculino e feminino para os 4 testes do edital, em 3 níveis', 'pcmg-2027/bonus-5.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-pcmg-2027';

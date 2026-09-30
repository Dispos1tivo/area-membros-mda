-- =====================================================================
-- Combo da Aprovação PMPE 2026 — produto e lista de materiais
-- Os PDFs vão no bucket "materiais", pasta "pmpe-2026", com estes nomes.
-- (conteúdo conforme a página de vendas em H:\MDA\PMPE PV)
-- =====================================================================

insert into public.produtos (slug, nome, etiqueta, descricao, ordem)
values (
  'combo-pmpe-2026',
  'Combo da Aprovação PMPE 2026',
  'PMPE 2026',
  '5 apostilas com o edital completo, 5 simulados no padrão Instituto AOCP com gabarito comentado e 5 bônus.',
  2
);

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Apostilas',  1, 'Apostila 1', 'Edital completo da PMPE', 'pmpe-2026/apostila-1.pdf'),
  ('Apostilas',  2, 'Apostila 2', 'Edital completo da PMPE', 'pmpe-2026/apostila-2.pdf'),
  ('Apostilas',  3, 'Apostila 3', 'Edital completo da PMPE', 'pmpe-2026/apostila-3.pdf'),
  ('Apostilas',  4, 'Apostila 4', 'Edital completo da PMPE', 'pmpe-2026/apostila-4.pdf'),
  ('Apostilas',  5, 'Apostila 5', 'Edital completo da PMPE', 'pmpe-2026/apostila-5.pdf'),
  ('Simulados', 11, 'Simulado 1', 'Padrão Instituto AOCP, com gabarito comentado', 'pmpe-2026/simulado-1.pdf'),
  ('Simulados', 12, 'Simulado 2', 'Padrão Instituto AOCP, com gabarito comentado', 'pmpe-2026/simulado-2.pdf'),
  ('Simulados', 13, 'Simulado 3', 'Padrão Instituto AOCP, com gabarito comentado', 'pmpe-2026/simulado-3.pdf'),
  ('Simulados', 14, 'Simulado 4', 'Padrão Instituto AOCP, com gabarito comentado', 'pmpe-2026/simulado-4.pdf'),
  ('Simulados', 15, 'Simulado 5', 'Padrão Instituto AOCP, com gabarito comentado', 'pmpe-2026/simulado-5.pdf'),
  ('Bônus', 21, 'Bônus 1 · Edital Verticalizado', 'O edital destrinchado assunto por assunto', 'pmpe-2026/bonus-1.pdf'),
  ('Bônus', 22, 'Bônus 2 · Planner de 30 Dias', 'Acompanhamento diário dos estudos e acertos', 'pmpe-2026/bonus-2.pdf'),
  ('Bônus', 23, 'Bônus 3 · Planejamento de Estudos', 'Sua semana de estudos já montada', 'pmpe-2026/bonus-3.pdf'),
  ('Bônus', 24, 'Bônus 4 · Prompts da Aprovação', 'Comandos prontos para estudar com IA', 'pmpe-2026/bonus-4.pdf'),
  ('Bônus', 25, 'Bônus 5 · Plano de Treino para o TAF', '3 planos por nível com os índices oficiais do edital', 'pmpe-2026/bonus-5.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-pmpe-2026';

-- =====================================================================
-- Combo da Aprovação PMMG 2027 — checkout e lista de materiais
-- Os PDFs vão no bucket "materiais", pasta "pmmg-2027", com estes nomes.
-- =====================================================================

update public.produtos
set checkout_url = 'https://pay.cakto.com.br/e5ah5n8_1006158',
    descricao    = '5 apostilas com o edital completo, 5 simulados no padrão CRS com gabarito comentado e 5 bônus.'
where slug = 'combo-pmmg-2027';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Apostilas',  1, 'Apostila 1', 'Edital completo da PMMG', 'pmmg-2027/apostila-1.pdf'),
  ('Apostilas',  2, 'Apostila 2', 'Edital completo da PMMG', 'pmmg-2027/apostila-2.pdf'),
  ('Apostilas',  3, 'Apostila 3', 'Edital completo da PMMG', 'pmmg-2027/apostila-3.pdf'),
  ('Apostilas',  4, 'Apostila 4', 'Edital completo da PMMG', 'pmmg-2027/apostila-4.pdf'),
  ('Apostilas',  5, 'Apostila 5', 'Edital completo da PMMG', 'pmmg-2027/apostila-5.pdf'),
  ('Simulados', 11, 'Simulado 1', 'Padrão CRS, com gabarito comentado', 'pmmg-2027/simulado-1.pdf'),
  ('Simulados', 12, 'Simulado 2', 'Padrão CRS, com gabarito comentado', 'pmmg-2027/simulado-2.pdf'),
  ('Simulados', 13, 'Simulado 3', 'Padrão CRS, com gabarito comentado', 'pmmg-2027/simulado-3.pdf'),
  ('Simulados', 14, 'Simulado 4', 'Padrão CRS, com gabarito comentado', 'pmmg-2027/simulado-4.pdf'),
  ('Simulados', 15, 'Simulado 5', 'Padrão CRS, com gabarito comentado', 'pmmg-2027/simulado-5.pdf'),
  ('Bônus', 21, 'Bônus 1 · Edital Verticalizado', 'O edital destrinchado assunto por assunto', 'pmmg-2027/bonus-1.pdf'),
  ('Bônus', 22, 'Bônus 2 · Planner de 30 Dias', 'Acompanhamento diário dos estudos e acertos', 'pmmg-2027/bonus-2.pdf'),
  ('Bônus', 23, 'Bônus 3 · Planejamento de Estudos', 'Sua semana de estudos já montada', 'pmmg-2027/bonus-3.pdf'),
  ('Bônus', 24, 'Bônus 4 · Prompts da Aprovação', 'Comandos prontos para estudar com IA', 'pmmg-2027/bonus-4.pdf'),
  ('Bônus', 25, 'Bônus 5 · Plano de Treino para o TAF', 'Planos do iniciante ao avançado', 'pmmg-2027/bonus-5.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-pmmg-2027';

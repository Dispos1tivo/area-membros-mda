-- =====================================================================
-- PMMG 2027 — materiais finais do Combo + order bump de Mapas Mentais
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
-- Os PDFs vão no bucket "materiais", pastas "pmmg-2027" e "mapas-pmmg-2027".
-- =====================================================================

-- ---------------------------------------------------------------------
-- Combo da Aprovação PMMG 2027 — apostilas identificadas pela matéria
-- ---------------------------------------------------------------------
update public.materiais m
set titulo    = v.titulo,
    descricao = v.descricao
from public.produtos p,
  (values
    ('pmmg-2027/apostila-1.pdf', 'Língua Portuguesa',                    'Apostila 1 · Conteúdo completo do edital da PMMG'),
    ('pmmg-2027/apostila-2.pdf', 'Literatura',                           'Apostila 2 · Conteúdo completo do edital da PMMG'),
    ('pmmg-2027/apostila-3.pdf', 'Noções de Língua Inglesa',             'Apostila 3 · Conteúdo completo do edital da PMMG'),
    ('pmmg-2027/apostila-4.pdf', 'Noções de Direito e Direitos Humanos', 'Apostila 4 · Conteúdo completo do edital da PMMG'),
    ('pmmg-2027/apostila-5.pdf', 'Raciocínio Lógico',                    'Apostila 5 · Conteúdo completo do edital da PMMG')
  ) as v (arquivo, titulo, descricao)
where m.produto_id = p.id
  and p.slug = 'combo-pmmg-2027'
  and m.arquivo = v.arquivo;

-- Simulados e bônus alinhados aos PDFs finais
update public.materiais
set descricao = '50 questões no padrão CRS, com gabarito comentado'
where arquivo like 'pmmg-2027/simulado-%';

update public.materiais
set descricao = case arquivo
  when 'pmmg-2027/bonus-1.pdf' then 'O edital do Soldado CFSD PMMG destrinchado assunto por assunto'
  when 'pmmg-2027/bonus-2.pdf' then 'Planner de 30 dias para acompanhar estudos e acertos'
  when 'pmmg-2027/bonus-3.pdf' then 'Cronograma semanal: sua semana de estudos já montada'
end
where arquivo in ('pmmg-2027/bonus-1.pdf', 'pmmg-2027/bonus-2.pdf', 'pmmg-2027/bonus-3.pdf');

-- Bônus 5 (TAF) vem em um PDF por nível
update public.materiais
set titulo    = 'Bônus 5 · Plano de Treino para o TAF · Iniciante',
    descricao = '8 semanas de progressão até bater os índices mínimos oficiais',
    arquivo   = 'pmmg-2027/bonus-5-iniciante.pdf'
where arquivo = 'pmmg-2027/bonus-5.pdf';

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Bônus', 26, 'Bônus 5 · Plano de Treino para o TAF · Intermediário', '6 semanas para consolidar e ganhar folga na pontuação', 'pmmg-2027/bonus-5-intermediario.pdf'),
  ('Bônus', 27, 'Bônus 5 · Plano de Treino para o TAF · Avançado', '4 semanas de polimento para chegar perto da nota máxima', 'pmmg-2027/bonus-5-avancado.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-pmmg-2027';

-- ---------------------------------------------------------------------
-- Order bump: Combo de Mapas Mentais PMMG 2027
-- (falta o link/id da Cakto: sem ele o webhook não reconhece a venda)
-- ---------------------------------------------------------------------
insert into public.produtos (slug, nome, etiqueta, descricao, ordem)
values (
  'mapas-mentais-pmmg-2027',
  'Combo de Mapas Mentais PMMG 2027',
  'PMMG 2027',
  '51 mapas mentais de Língua Portuguesa, Direito e Direitos Humanos e Raciocínio Lógico-Matemático para revisar o edital.',
  3
);

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Mapas Mentais', 1, 'Língua Portuguesa',             '28 mapas mentais', 'mapas-pmmg-2027/mapas-1.pdf'),
  ('Mapas Mentais', 2, 'Direito e Direitos Humanos',    '13 mapas mentais', 'mapas-pmmg-2027/mapas-2.pdf'),
  ('Mapas Mentais', 3, 'Raciocínio Lógico-Matemático',  '10 mapas mentais', 'mapas-pmmg-2027/mapas-3.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'mapas-mentais-pmmg-2027';

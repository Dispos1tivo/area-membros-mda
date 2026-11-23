-- 23/11/2026: os 8 PDFs de mapas da PMERJ têm 87 mapas (não 64). O PDF de Penal e Processo Penal
-- tem 22 páginas, 2 delas capas de matéria; os outros têm 9 ou 10 mapas.
update public.produtos
set descricao = '87 mapas mentais das matérias do edital de Soldado da PMERJ e da redação, para revisar o conteúdo.',
    destaques = '{"87 mapas mentais","8 PDFs"}'::text[]
where slug = 'mapas-mentais-pmerj-2027';

update public.materiais m
set descricao = v.descricao
from (values
  ('nova-marca/mapas-pmerj-2027/mapas-1.pdf', '9 mapas mentais'),
  ('nova-marca/mapas-pmerj-2027/mapas-2.pdf', '9 mapas mentais'),
  ('nova-marca/mapas-pmerj-2027/mapas-3.pdf', '10 mapas mentais'),
  ('nova-marca/mapas-pmerj-2027/mapas-4.pdf', '10 mapas mentais'),
  ('nova-marca/mapas-pmerj-2027/mapas-5.pdf', '10 mapas mentais'),
  ('nova-marca/mapas-pmerj-2027/mapas-6.pdf', '20 mapas mentais'),
  ('nova-marca/mapas-pmerj-2027/mapas-7.pdf', '10 mapas mentais'),
  ('nova-marca/mapas-pmerj-2027/mapas-8.pdf', '9 mapas mentais')
) as v (arquivo, descricao)
where m.arquivo = v.arquivo;

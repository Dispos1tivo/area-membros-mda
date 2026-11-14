-- =====================================================================
-- PRF — 14/11/2026: chegaram as apostilas 5 (Geopolítica e Língua Estrangeira) e
-- 9 (Direito Penal e Processual Penal). O Combo PRF passa a ter as 10 apostilas.
-- PDFs em nova-marca/prf-2027/apostila-5.pdf e apostila-9.pdf. Pode rodar mais de uma vez.
-- =====================================================================

update public.produtos
set descricao = '10 apostilas com o edital completo, 5 simulados de 120 itens no padrão Cebraspe com gabarito comentado e 5 bônus.',
    destaques = '{"10 apostilas","5 simulados","5 bônus"}'::text[]
where slug = 'combo-prf-2027';

delete from public.materiais
where arquivo in ('nova-marca/prf-2027/apostila-5.pdf', 'nova-marca/prf-2027/apostila-9.pdf');

insert into public.materiais (produto_id, secao, ordem, titulo, descricao, arquivo)
select p.id, m.secao, m.ordem, m.titulo, m.descricao, m.arquivo
from public.produtos p
cross join (values
  ('Apostilas', 5, 'Geopolítica e Língua Estrangeira', 'Apostila 5 · Teoria do edital da PRF no estilo Cebraspe', 'nova-marca/prf-2027/apostila-5.pdf'),
  ('Apostilas', 9, 'Direito Penal e Processual Penal', 'Apostila 9 · Teoria do edital da PRF no estilo Cebraspe', 'nova-marca/prf-2027/apostila-9.pdf')
) as m (secao, ordem, titulo, descricao, arquivo)
where p.slug = 'combo-prf-2027';

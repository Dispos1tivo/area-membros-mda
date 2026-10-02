-- =====================================================================
-- Order bumps de Mapas Mentais — id do produto na Cakto
-- (é por ele que o webhook reconhece a venda e libera o acesso)
-- =====================================================================

update public.produtos
set cakto_produto_id = case slug
  when 'mapas-mentais-pmpe-2026' then '915c5097-5ef1-4083-ac3e-df5d1c3c9c26'
  when 'mapas-mentais-pmmg-2027' then '555b8249-18ba-4fdf-a913-49c126259793'
end
where slug in ('mapas-mentais-pmpe-2026', 'mapas-mentais-pmmg-2027');

-- Nome do order bump da PMPE igual ao da Cakto (2027)
update public.produtos
set nome = 'Combo de Mapas Mentais PMPE 2027',
    etiqueta = 'PMPE 2027'
where slug = 'mapas-mentais-pmpe-2026';

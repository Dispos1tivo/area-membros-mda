-- Mapas mentais da PMPE com a logo MDA Concursos menor nas páginas de dentro (04/11/2026, pedido do usuário).
-- Os arquivos estão em nova-marca/mapas-pmpe-2026-v2/; a versão anterior (sem logo) fica em nova-marca/mapas-pmpe-2026/, sem uso.
update public.materiais m
set arquivo = replace(m.arquivo, 'nova-marca/mapas-pmpe-2026/', 'nova-marca/mapas-pmpe-2026-v2/')
where m.arquivo like 'nova-marca/mapas-pmpe-2026/%'
  and exists (select 1 from storage.objects o where o.bucket_id = 'materiais' and o.name = replace(m.arquivo, 'nova-marca/mapas-pmpe-2026/', 'nova-marca/mapas-pmpe-2026-v2/'));

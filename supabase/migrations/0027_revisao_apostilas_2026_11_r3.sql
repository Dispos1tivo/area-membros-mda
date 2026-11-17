-- Revisão das apostilas, rodada 3 (2026-11-17): 24 PDFs corrigidos com as dúvidas pesquisadas (22 apostilas/mapas/bônus
-- + simulados 3 e 4 da PMMG com 4 alternativas) foram enviados para materiais/revisao-2026-11-r3/<pasta>/<nome>.
-- Aqui as linhas de materiais passam a apontar para eles (antes: nova-marca/, revisao-2026-11/ ou revisao-2026-11-r2/).
-- Só troca se o arquivo novo existir no bucket. Para desfazer: voltar o prefixo (os objetos antigos continuam no bucket).
update public.materiais m
   set arquivo = 'revisao-2026-11-r3/' || substring(m.arquivo from '^[^/]+/(.*)$')
 where substring(m.arquivo from '^[^/]+/(.*)$') in (
  'pcmg-2027/apostila-1.pdf',
  'pcmg-2027/apostila-4.pdf',
  'pcmg-2027/apostila-6.pdf',
  'mapas-pcmg-2027/mapas-4.pdf',
  'mapas-pcmg-2027/mapas-5.pdf',
  'mapas-pcmg-2027/mapas-7.pdf',
  'mapas-pmmg-2027/mapas-1.pdf',
  'pmmg-2027/simulado-3.pdf',
  'pmmg-2027/simulado-4.pdf',
  'pmpe-2026/apostila-1.pdf',
  'pmpe-2026/apostila-2.pdf',
  'pmpe-2026/apostila-3.pdf',
  'pmpe-2026/apostila-4.pdf',
  'pmpe-2026/apostila-5.pdf',
  'pmpe-2026/bonus-1.pdf',
  'pmpe-2026/bonus-3.pdf',
  'mapas-pmpe-2026-v2/mapas-1.pdf',
  'mapas-pmpe-2026-v2/mapas-4.pdf',
  'prf-2027/apostila-9.pdf',
  'prf-2027/bonus-1.pdf',
  'prf-2027/bonus-5.pdf',
  'pmesp-2027-v2/apostila-4.pdf',
  'pmesp-2027-v2/apostila-5.pdf',
  'mapas-pmesp-2027-v2/mapas-3.pdf'
 )
   and m.arquivo not like 'revisao-2026-11-r3/%'
   and exists (select 1 from storage.objects o where o.bucket_id = 'materiais'
               and o.name = 'revisao-2026-11-r3/' || substring(m.arquivo from '^[^/]+/(.*)$'));

-- 2026-11-17: apostilas 4 e 5 da PMPE com a numeração certa no rodapé e na capa (antes diziam "Apostila 1" e "Apostila 2").
-- Os PDFs foram enviados para materiais/revisao-2026-11-r4/pmpe-2026/. Só troca se o arquivo novo existir no bucket.
-- Para desfazer: voltar para revisao-2026-11-r3/ (os objetos antigos continuam no bucket).
update public.materiais m
   set arquivo = 'revisao-2026-11-r4/' || substring(m.arquivo from '^[^/]+/(.*)$')
 where substring(m.arquivo from '^[^/]+/(.*)$') in ('pmpe-2026/apostila-4.pdf', 'pmpe-2026/apostila-5.pdf')
   and m.arquivo not like 'revisao-2026-11-r4/%'
   and exists (select 1 from storage.objects o where o.bucket_id = 'materiais'
               and o.name = 'revisao-2026-11-r4/' || substring(m.arquivo from '^[^/]+/(.*)$'));

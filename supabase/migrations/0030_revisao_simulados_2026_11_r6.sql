-- 2026-11-17: comentários de 5 questões dos simulados em PDF iguais aos do app (o app corrigiu esses comentários em 17/11):
-- PMPE simulados 1 (tortura x abuso de autoridade) e 5 (Guerra dos Mascates: Recife "vila, com câmara própria"),
-- PMESP simulados 1 (EC 141/2026) e 4 (Lei da Anistia, "crimes conexos"), PRF simulado 1 (art. 29, VII, do CTB).
-- Os PDFs foram enviados para materiais/revisao-2026-11-r6/. Só troca se o arquivo novo existir no bucket.
-- Para desfazer: voltar o prefixo anterior (revisao-2026-11/).
update public.materiais m
   set arquivo = 'revisao-2026-11-r6/' || substring(m.arquivo from '^[^/]+/(.*)$')
 where substring(m.arquivo from '^[^/]+/(.*)$') in ('pmpe-2026/simulado-1.pdf', 'pmpe-2026/simulado-5.pdf',
                                                    'pmesp-2027-v2/simulado-1.pdf', 'pmesp-2027-v2/simulado-4.pdf',
                                                    'prf-2027/simulado-1.pdf')
   and m.arquivo not like 'revisao-2026-11-r6/%'
   and exists (select 1 from storage.objects o where o.bucket_id = 'materiais'
               and o.name = 'revisao-2026-11-r6/' || substring(m.arquivo from '^[^/]+/(.*)$'));

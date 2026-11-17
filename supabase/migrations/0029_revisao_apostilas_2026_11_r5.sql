-- 2026-11-17: 4ª rodada da revisão das apostilas (súmula 6 e Governador na PMPE ap. 4; lista de Português do edital da PMPE
-- no verticalizado e na apostila 1; PEC da Segurança "aprovada, aguardando promulgação" na PCMG ap. 8). Os PDFs foram enviados
-- para materiais/revisao-2026-11-r5/. Só troca se o arquivo novo existir no bucket. Para desfazer: voltar o prefixo anterior.
update public.materiais m
   set arquivo = 'revisao-2026-11-r5/' || substring(m.arquivo from '^[^/]+/(.*)$')
 where substring(m.arquivo from '^[^/]+/(.*)$') in ('pcmg-2027/apostila-8.pdf', 'pmpe-2026/apostila-1.pdf', 'pmpe-2026/apostila-4.pdf', 'pmpe-2026/bonus-1.pdf')
   and m.arquivo not like 'revisao-2026-11-r5/%'
   and exists (select 1 from storage.objects o where o.bucket_id = 'materiais'
               and o.name = 'revisao-2026-11-r5/' || substring(m.arquivo from '^[^/]+/(.*)$'));

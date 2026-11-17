-- =====================================================================
-- Revisão de conteúdo — 16/11/2026: 45 PDFs corrigidos (leis novas e erros),
-- os mesmos que foram para o app. Erros graves corrigidos dentro da página;
-- os demais numa lista "O que mudou" no final do PDF, com faixa na página.
-- Arquivos novos em revisao-2026-11/<mesma pasta>/<mesmo nome> (o Studio não
-- substitui arquivo com o mesmo nome). Os antigos ficam em nova-marca/, sem uso.
-- Só troca a linha se o arquivo novo existir no bucket. Pode rodar mais de uma vez.
-- Para voltar: trocar 'revisao-2026-11/' por 'nova-marca/' nas mesmas linhas.
-- =====================================================================

update public.materiais m
set arquivo = replace(m.arquivo, 'nova-marca/', 'revisao-2026-11/')
where m.arquivo in (
  'nova-marca/pcmg-2027/apostila-5.pdf', 'nova-marca/pcmg-2027/apostila-6.pdf',
  'nova-marca/pcmg-2027/apostila-7.pdf', 'nova-marca/pcmg-2027/apostila-8.pdf',
  'nova-marca/pcmg-2027/simulado-1.pdf', 'nova-marca/pcmg-2027/simulado-2.pdf',
  'nova-marca/pcmg-2027/simulado-3.pdf', 'nova-marca/pcmg-2027/simulado-4.pdf',
  'nova-marca/pcmg-2027/simulado-5.pdf',
  'nova-marca/mapas-pcmg-2027/mapas-4.pdf', 'nova-marca/mapas-pcmg-2027/mapas-6.pdf',
  'nova-marca/mapas-pcmg-2027/mapas-7.pdf', 'nova-marca/mapas-pcmg-2027/mapas-8.pdf',
  'nova-marca/pmmg-2027/apostila-4.pdf',
  'nova-marca/pmmg-2027/simulado-1.pdf', 'nova-marca/pmmg-2027/simulado-2.pdf',
  'nova-marca/pmmg-2027/simulado-3.pdf', 'nova-marca/pmmg-2027/simulado-4.pdf',
  'nova-marca/pmmg-2027/simulado-5.pdf',
  'nova-marca/pmpe-2026/apostila-4.pdf', 'nova-marca/pmpe-2026/apostila-5.pdf',
  'nova-marca/pmpe-2026/simulado-1.pdf', 'nova-marca/pmpe-2026/simulado-2.pdf',
  'nova-marca/pmpe-2026/simulado-3.pdf', 'nova-marca/pmpe-2026/simulado-4.pdf',
  'nova-marca/pmpe-2026/simulado-5.pdf',
  'nova-marca/mapas-pmpe-2026-v2/mapas-4.pdf',
  'nova-marca/prf-2027/apostila-4.pdf', 'nova-marca/prf-2027/apostila-6.pdf',
  'nova-marca/prf-2027/apostila-9.pdf', 'nova-marca/prf-2027/apostila-10.pdf',
  'nova-marca/prf-2027/simulado-1.pdf', 'nova-marca/prf-2027/simulado-2.pdf',
  'nova-marca/prf-2027/simulado-3.pdf', 'nova-marca/prf-2027/simulado-4.pdf',
  'nova-marca/prf-2027/simulado-5.pdf',
  'nova-marca/mapas-prf-2027/mapas-9.pdf', 'nova-marca/mapas-prf-2027/mapas-10.pdf',
  'nova-marca/pmesp-2027-v2/apostila-5.pdf', 'nova-marca/pmesp-2027-v2/apostila-7.pdf',
  'nova-marca/pmesp-2027-v2/simulado-1.pdf', 'nova-marca/pmesp-2027-v2/simulado-2.pdf',
  'nova-marca/pmesp-2027-v2/simulado-3.pdf', 'nova-marca/pmesp-2027-v2/simulado-4.pdf',
  'nova-marca/pmesp-2027-v2/simulado-5.pdf'
)
and exists (
  select 1 from storage.objects o
  where o.bucket_id = 'materiais'
    and o.name = replace(m.arquivo, 'nova-marca/', 'revisao-2026-11/')
);

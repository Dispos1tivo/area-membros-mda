-- =====================================================================
-- PMESP — 14/11/2026: PDFs sem o texto escondido da PCMG.
-- Os PDFs originais traziam, por baixo do logo do rodapé, a página inteira de um material da PCMG
-- (invisível, mas aparecia ao copiar/buscar). As versões limpas, com a mesma aparência, estão em
-- nova-marca/pmesp-2027-v2 e nova-marca/mapas-pmesp-2027-v2 (mesmos nomes de arquivo).
-- Pode rodar mais de uma vez.
-- =====================================================================

update public.materiais
set arquivo = replace(arquivo, 'nova-marca/pmesp-2027/', 'nova-marca/pmesp-2027-v2/')
where arquivo like 'nova-marca/pmesp-2027/%';

update public.materiais
set arquivo = replace(arquivo, 'nova-marca/mapas-pmesp-2027/', 'nova-marca/mapas-pmesp-2027-v2/')
where arquivo like 'nova-marca/mapas-pmesp-2027/%';

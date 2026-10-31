-- =====================================================================
-- Combo da Aprovação PMPE passa a ser 2027 (prova em 21/02/2027).
-- O slug continua combo-pmpe-2026 (endereço e pasta do bucket não mudam).
-- =====================================================================

update public.produtos
set nome = 'Combo da Aprovação PMPE 2027',
    etiqueta = 'PMPE 2027'
where slug = 'combo-pmpe-2026';

-- =====================================================================
-- Área de Membros MDA — e-mail de boas-vindas depois da compra
-- =====================================================================

-- Quando o e-mail de boas-vindas daquele produto saiu para o aluno.
-- Combo + order bump chegam em avisos separados da Cakto: o primeiro que
-- "pega" as liberações recentes sem e-mail manda um único e-mail com todas.
alter table public.acessos add column boas_vindas_em timestamptz;

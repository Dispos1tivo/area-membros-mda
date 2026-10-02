-- =====================================================================
-- Combo da Aprovação PMPE 2026 — checkout e id do produto na Cakto
-- =====================================================================

update public.produtos
set cakto_produto_id = '2fd0afa4-9310-4bed-9c6b-ddf6b0f3e643',
    checkout_url = 'https://pay.cakto.com.br/4dr9ytp_1159283'
where slug = 'combo-pmpe-2026';

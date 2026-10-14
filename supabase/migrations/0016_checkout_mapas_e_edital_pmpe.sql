-- =====================================================================
-- Área de Membros MDA — checkout dos combos de mapas mentais e link
-- oficial do concurso da PMPE
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
-- =====================================================================

-- Links "Oferta Principal" de cada produto na Cakto (R$ 9,90 cada).
-- Com eles, o cartão em "Complete sua preparação" troca "Em breve" por "Liberar acesso".
update public.produtos set checkout_url = 'https://pay.cakto.com.br/35ayddg_1019335' where slug = 'mapas-mentais-pmmg-2027';
update public.produtos set checkout_url = 'https://pay.cakto.com.br/p8t53pu_1161379' where slug = 'mapas-mentais-pmpe-2026';
update public.produtos set checkout_url = 'https://pay.cakto.com.br/3d3mz7e_1198790' where slug = 'mapas-mentais-pcmg-2027';

-- Página do concurso no site da banca (antes era a página inicial do Instituto AOCP)
update public.concursos
set fonte_url = 'https://www.institutoaocp.org.br/concursos/714',
    atualizado_em = '2026-10-14'
where sigla = 'PMPE';

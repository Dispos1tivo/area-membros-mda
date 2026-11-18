-- Checagem de segurança de 18/11/2026.
-- criar_perfil (gatilho que cria o perfil quando nasce um aluno) e rls_auto_enable
-- (gatilho que liga a proteção em tabela nova) são internas: só o banco chama.
-- Tira a permissão de chamar pela API, para o aviso do Supabase sumir.
-- Os gatilhos continuam funcionando: o Postgres só confere essa permissão ao criar o gatilho.

revoke execute on function public.criar_perfil() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Garantia extra: o serviço de login do Supabase (quem cria o aluno) continua podendo rodar o gatilho.
-- Esse papel não é exposto pela API.
grant execute on function public.criar_perfil() to supabase_auth_admin;

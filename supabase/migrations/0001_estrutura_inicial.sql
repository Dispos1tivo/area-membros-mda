-- =====================================================================
-- Área de Membros MDA — estrutura inicial
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
-- =====================================================================

-- Perfil de cada aluno (1 para 1 com auth.users, criado automaticamente)
create table public.perfis (
  id        uuid primary key references auth.users (id) on delete cascade,
  email     text not null,
  nome      text,
  criado_em timestamptz not null default now()
);

alter table public.perfis enable row level security;

-- O aluno só enxerga e edita o próprio perfil
create policy "aluno le o proprio perfil"
  on public.perfis for select to authenticated
  using ((select auth.uid()) = id);

create policy "aluno atualiza o proprio perfil"
  on public.perfis for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Permissões explícitas (o projeto não expõe tabelas novas automaticamente):
-- visitante (anon) não acessa nada; aluno logado lê e só pode mudar o nome.
revoke all on public.perfis from anon, authenticated;
grant select on public.perfis to authenticated;
grant update (nome) on public.perfis to authenticated;
-- servidor (webhook da Cakto, no futuro) tem acesso total
grant all on public.perfis to service_role;

-- Cria o perfil sempre que um usuário novo entra em auth.users
-- (hoje: cadastro manual no painel; depois: webhook da Cakto)
create function public.criar_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (id, email, nome)
  values (new.id, new.email, new.raw_user_meta_data ->> 'nome');
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();

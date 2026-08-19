-- Tabela de perfil 1:1 com auth.users (padrão recomendado pelo Supabase:
-- nunca modelar autenticação própria, sempre estender auth.users via perfil público).
create table public.profiles (
  id        uuid primary key references auth.users (id) on delete cascade,
  nome      text not null,
  email     text not null,
  criado_em timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Policy de SELECT para perfis de colegas de propriedade é adicionada depois,
-- na migration de propriedades_usuarios (a tabela ainda não existe aqui).
create policy "profiles_select_propria"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy "profiles_update_propria"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Cria automaticamente o perfil público quando um usuário se cadastra no Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

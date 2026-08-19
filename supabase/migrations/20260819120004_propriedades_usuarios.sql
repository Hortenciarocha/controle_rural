create table public.propriedades_usuarios (
  id             uuid primary key default gen_random_uuid(),
  usuario_id     uuid not null references auth.users (id) on delete cascade,
  propriedade_id uuid not null references public.propriedades (id) on delete cascade,
  papel          text not null check (papel in ('proprietario', 'funcionario')),
  criado_em      timestamptz not null default now(),
  unique (usuario_id, propriedade_id)
);

create index propriedades_usuarios_usuario_id_idx on public.propriedades_usuarios (usuario_id);
create index propriedades_usuarios_propriedade_id_idx on public.propriedades_usuarios (propriedade_id);

alter table public.propriedades_usuarios enable row level security;

-- Função auxiliar central: responde "o usuário logado tem acesso a esta
-- propriedade (e, opcionalmente, com qual papel)?". security definer para
-- poder ler propriedades_usuarios sem entrar em recursão de RLS; stable +
-- índice acima garantem que isso é rápido e cacheável por statement.
create or replace function private.tem_acesso_propriedade(p_propriedade_id uuid, p_papel text default null)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.propriedades_usuarios pu
    where pu.propriedade_id = p_propriedade_id
      and pu.usuario_id = (select auth.uid())
      and (p_papel is null or pu.papel = p_papel)
  );
$$;

revoke execute on function private.tem_acesso_propriedade(uuid, text) from public, anon;
grant execute on function private.tem_acesso_propriedade(uuid, text) to authenticated;

-- Policies de propriedades_usuarios: cada membro vê os vínculos da(s)
-- propriedade(s) de que participa; só o proprietário gerencia vínculos
-- (convidar/remover funcionário é Versão 2, mas o modelo já suporta).
create policy "propriedades_usuarios_select_membro"
  on public.propriedades_usuarios
  for select
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id));

create policy "propriedades_usuarios_insert_proprietario"
  on public.propriedades_usuarios
  for insert
  to authenticated
  with check (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

create policy "propriedades_usuarios_update_proprietario"
  on public.propriedades_usuarios
  for update
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id, 'proprietario'))
  with check (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

create policy "propriedades_usuarios_delete_proprietario"
  on public.propriedades_usuarios
  for delete
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

-- Agora que propriedades_usuarios existe, completa as policies de propriedades.
create policy "propriedades_select_membro"
  on public.propriedades
  for select
  to authenticated
  using (private.tem_acesso_propriedade(id));

create policy "propriedades_update_membro"
  on public.propriedades
  for update
  to authenticated
  using (private.tem_acesso_propriedade(id))
  with check (private.tem_acesso_propriedade(id));

create policy "propriedades_delete_proprietario"
  on public.propriedades
  for delete
  to authenticated
  using (private.tem_acesso_propriedade(id, 'proprietario'));

-- Sem policy de INSERT direto em propriedades: a criação só acontece via
-- RPC criar_propriedade abaixo, que cria propriedade + vínculo em uma
-- transação atômica (resolve o problema de "ovo e galinha" do RLS: não dá
-- para checar acesso a uma propriedade que ainda não tem vínculo nenhum).
create or replace function public.criar_propriedade(p_nome text, p_localizacao text, p_area_total numeric)
returns public.propriedades
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_propriedade public.propriedades;
begin
  if (select auth.uid()) is null then
    raise exception 'Usuário não autenticado';
  end if;

  insert into public.propriedades (nome, localizacao, area_total)
  values (p_nome, p_localizacao, p_area_total)
  returning * into v_propriedade;

  insert into public.propriedades_usuarios (usuario_id, propriedade_id, papel)
  values ((select auth.uid()), v_propriedade.id, 'proprietario');

  return v_propriedade;
end;
$$;

revoke execute on function public.criar_propriedade(text, text, numeric) from public, anon;
grant execute on function public.criar_propriedade(text, text, numeric) to authenticated;

-- Agora que propriedades_usuarios existe, permite ver o perfil de colegas
-- vinculados à(s) mesma(s) propriedade(s) (útil para exibir "responsável"
-- em atividades, por exemplo).
create policy "profiles_select_colega_de_propriedade"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.propriedades_usuarios pu_eu
      join public.propriedades_usuarios pu_colega
        on pu_colega.propriedade_id = pu_eu.propriedade_id
      where pu_eu.usuario_id = (select auth.uid())
        and pu_colega.usuario_id = public.profiles.id
    )
  );

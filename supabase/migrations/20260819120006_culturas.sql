-- propriedade_id nulo = catálogo global (culturas padrão, ver seed.sql);
-- propriedade_id preenchido = cultura customizada de uma propriedade.
create table public.culturas (
  id                 uuid primary key default gen_random_uuid(),
  propriedade_id     uuid references public.propriedades (id) on delete cascade,
  nome               text not null,
  ciclo_medio_dias   integer not null check (ciclo_medio_dias > 0),
  unidade_producao   text not null,
  criado_em          timestamptz not null default now()
);

create index culturas_propriedade_id_idx on public.culturas (propriedade_id) where propriedade_id is not null;

-- Evita duplicar entradas do catálogo global ao reexecutar o seed.sql.
create unique index culturas_nome_global_key on public.culturas (nome) where propriedade_id is null;

alter table public.culturas enable row level security;

-- SELECT: catálogo global (visível a todos os autenticados) + culturas
-- customizadas das propriedades de que o usuário participa.
create policy "culturas_select_global_ou_membro"
  on public.culturas
  for select
  to authenticated
  using (
    propriedade_id is null
    or private.tem_acesso_propriedade(propriedade_id)
  );

-- INSERT/UPDATE/DELETE: só em culturas customizadas da própria propriedade
-- (ninguém cria/edita/apaga o catálogo global pelo cliente).
create policy "culturas_insert_membro"
  on public.culturas
  for insert
  to authenticated
  with check (propriedade_id is not null and private.tem_acesso_propriedade(propriedade_id));

create policy "culturas_update_membro"
  on public.culturas
  for update
  to authenticated
  using (propriedade_id is not null and private.tem_acesso_propriedade(propriedade_id))
  with check (propriedade_id is not null and private.tem_acesso_propriedade(propriedade_id));

create policy "culturas_delete_proprietario"
  on public.culturas
  for delete
  to authenticated
  using (propriedade_id is not null and private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

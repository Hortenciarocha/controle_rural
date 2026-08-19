create table public.eventos_sanitarios (
  id            uuid primary key default gen_random_uuid(),
  animal_id     uuid not null references public.animais (id) on delete cascade,
  tipo          text not null check (tipo in ('vacina', 'tratamento', 'outro')),
  descricao     text not null,
  data          date not null default current_date,
  proxima_data  date,
  responsavel   text,
  criado_em     timestamptz not null default now()
);

create index eventos_sanitarios_animal_id_idx on public.eventos_sanitarios (animal_id);
create index eventos_sanitarios_proxima_data_idx
  on public.eventos_sanitarios (proxima_data)
  where proxima_data is not null;

alter table public.eventos_sanitarios enable row level security;

create policy "eventos_sanitarios_select_membro"
  on public.eventos_sanitarios
  for select
  to authenticated
  using (
    exists (
      select 1 from public.animais a
      where a.id = eventos_sanitarios.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id)
    )
  );

create policy "eventos_sanitarios_insert_membro"
  on public.eventos_sanitarios
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.animais a
      where a.id = eventos_sanitarios.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id)
    )
  );

create policy "eventos_sanitarios_update_membro"
  on public.eventos_sanitarios
  for update
  to authenticated
  using (
    exists (
      select 1 from public.animais a
      where a.id = eventos_sanitarios.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id)
    )
  )
  with check (
    exists (
      select 1 from public.animais a
      where a.id = eventos_sanitarios.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id)
    )
  );

create policy "eventos_sanitarios_delete_proprietario"
  on public.eventos_sanitarios
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.animais a
      where a.id = eventos_sanitarios.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id, 'proprietario')
    )
  );

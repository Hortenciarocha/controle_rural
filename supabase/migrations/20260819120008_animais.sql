create table public.animais (
  id               uuid primary key default gen_random_uuid(),
  propriedade_id   uuid not null references public.propriedades (id) on delete cascade,
  especie          text not null,
  raca             text,
  sexo             text check (sexo in ('macho', 'femea')),
  data_nascimento  date,
  peso             numeric(8, 2) check (peso is null or peso > 0),
  identificacao    text,
  observacoes      text,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);

create index animais_propriedade_id_idx on public.animais (propriedade_id);
create unique index animais_propriedade_id_identificacao_key
  on public.animais (propriedade_id, identificacao)
  where identificacao is not null;

create trigger animais_set_atualizado_em
  before update on public.animais
  for each row execute function public.set_atualizado_em();

alter table public.animais enable row level security;

create policy "animais_select_membro"
  on public.animais
  for select
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id));

create policy "animais_insert_membro"
  on public.animais
  for insert
  to authenticated
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "animais_update_membro"
  on public.animais
  for update
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id))
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "animais_delete_proprietario"
  on public.animais
  for delete
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

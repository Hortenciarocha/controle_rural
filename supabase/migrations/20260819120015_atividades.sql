create table public.atividades (
  id             uuid primary key default gen_random_uuid(),
  propriedade_id uuid not null references public.propriedades (id) on delete cascade,
  titulo         text not null,
  tipo           text not null check (
    tipo in (
      'plantio', 'irrigacao', 'adubacao', 'aplicacao_produtos', 'vacinacao',
      'alimentacao', 'manutencao', 'colheita', 'outras'
    )
  ),
  data_prevista  date not null,
  status         text not null default 'pendente' check (status in ('pendente', 'em_andamento', 'concluida')),
  responsavel_id uuid references auth.users (id) on delete set null,
  descricao      text,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

create index atividades_propriedade_id_idx on public.atividades (propriedade_id);
create index atividades_propriedade_id_status_data_idx
  on public.atividades (propriedade_id, status, data_prevista);

create trigger atividades_set_atualizado_em
  before update on public.atividades
  for each row execute function public.set_atualizado_em();

alter table public.atividades enable row level security;

create policy "atividades_select_membro"
  on public.atividades
  for select
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id));

create policy "atividades_insert_membro"
  on public.atividades
  for insert
  to authenticated
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "atividades_update_membro"
  on public.atividades
  for update
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id))
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "atividades_delete_proprietario"
  on public.atividades
  for delete
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

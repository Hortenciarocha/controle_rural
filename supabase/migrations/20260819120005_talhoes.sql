create table public.talhoes (
  id             uuid primary key default gen_random_uuid(),
  propriedade_id uuid not null references public.propriedades (id) on delete cascade,
  nome           text not null,
  area           numeric(10, 2) not null check (area > 0),
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

create index talhoes_propriedade_id_idx on public.talhoes (propriedade_id);

create trigger talhoes_set_atualizado_em
  before update on public.talhoes
  for each row execute function public.set_atualizado_em();

alter table public.talhoes enable row level security;

-- Padrão reaplicado em animais, estoque_itens, financeiro_lancamentos,
-- atividades e alertas: SELECT/INSERT/UPDATE para qualquer vinculado à
-- propriedade, DELETE restrito ao proprietário (funcionário não apaga
-- histórico; permissões mais finas por módulo ficam para a Versão 2).
create policy "talhoes_select_membro"
  on public.talhoes
  for select
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id));

create policy "talhoes_insert_membro"
  on public.talhoes
  for insert
  to authenticated
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "talhoes_update_membro"
  on public.talhoes
  for update
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id))
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "talhoes_delete_proprietario"
  on public.talhoes
  for delete
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

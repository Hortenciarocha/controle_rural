create table public.financeiro_lancamentos (
  id                       uuid primary key default gen_random_uuid(),
  propriedade_id           uuid not null references public.propriedades (id) on delete cascade,
  tipo                     text not null check (tipo in ('receita', 'despesa')),
  categoria                text not null,
  valor                    numeric(12, 2) not null check (valor > 0),
  data                     date not null default current_date,
  descricao                text,
  -- Vínculo opcional com uma movimentação de estoque de origem (ex.: despesa
  -- de ração lançada a partir de uma entrada de estoque). O PRD só cita esse
  -- caso; não modelamos uma FK polimórfica genérica para outros módulos.
  movimentacao_estoque_id  uuid references public.movimentacoes_estoque (id) on delete set null,
  registrado_por           uuid references auth.users (id) default auth.uid(),
  criado_em                timestamptz not null default now(),
  atualizado_em            timestamptz not null default now()
);

create index financeiro_lancamentos_propriedade_id_idx on public.financeiro_lancamentos (propriedade_id);
create index financeiro_lancamentos_propriedade_id_data_idx on public.financeiro_lancamentos (propriedade_id, data);
create index financeiro_lancamentos_propriedade_id_tipo_data_idx
  on public.financeiro_lancamentos (propriedade_id, tipo, data);

create trigger financeiro_lancamentos_set_atualizado_em
  before update on public.financeiro_lancamentos
  for each row execute function public.set_atualizado_em();

alter table public.financeiro_lancamentos enable row level security;

create policy "financeiro_lancamentos_select_membro"
  on public.financeiro_lancamentos
  for select
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id));

create policy "financeiro_lancamentos_insert_membro"
  on public.financeiro_lancamentos
  for insert
  to authenticated
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "financeiro_lancamentos_update_membro"
  on public.financeiro_lancamentos
  for update
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id))
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "financeiro_lancamentos_delete_proprietario"
  on public.financeiro_lancamentos
  for delete
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

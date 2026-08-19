create table public.alertas (
  id                 uuid primary key default gen_random_uuid(),
  propriedade_id     uuid not null references public.propriedades (id) on delete cascade,
  tipo               text not null,
  mensagem           text not null,
  nivel              text not null default 'atencao' check (nivel in ('info', 'atencao', 'urgente')),
  referencia_tabela  text,
  referencia_id      uuid,
  lido               boolean not null default false,
  criado_em          timestamptz not null default now()
);

create index alertas_propriedade_id_lido_idx on public.alertas (propriedade_id, lido);
create index alertas_propriedade_id_criado_em_idx on public.alertas (propriedade_id, criado_em desc);

alter table public.alertas enable row level security;

create policy "alertas_select_membro"
  on public.alertas
  for select
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id));

-- INSERT de alertas acontece via trigger (security definer), mas mantemos
-- uma policy de INSERT para membros também, para casos futuros de alerta
-- criado diretamente pela aplicação (ex.: IA-6 na Versão 2).
create policy "alertas_insert_membro"
  on public.alertas
  for insert
  to authenticated
  with check (private.tem_acesso_propriedade(propriedade_id));

-- UPDATE cobre a ação mais comum do usuário: marcar alerta como lido.
create policy "alertas_update_membro"
  on public.alertas
  for update
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id))
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "alertas_delete_proprietario"
  on public.alertas
  for delete
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

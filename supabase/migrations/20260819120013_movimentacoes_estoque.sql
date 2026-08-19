create table public.movimentacoes_estoque (
  id             uuid primary key default gen_random_uuid(),
  item_id        uuid not null references public.estoque_itens (id) on delete cascade,
  tipo           text not null check (tipo in ('entrada', 'saida')),
  quantidade     numeric(12, 3) not null check (quantidade > 0),
  data           date not null default current_date,
  custo          numeric(12, 2) check (custo is null or custo >= 0),
  motivo         text,
  fornecedor     text,
  registrado_por uuid references auth.users (id) default auth.uid(),
  criado_em      timestamptz not null default now()
);

create index movimentacoes_estoque_item_id_idx on public.movimentacoes_estoque (item_id);
create index movimentacoes_estoque_data_idx on public.movimentacoes_estoque (data);

alter table public.movimentacoes_estoque enable row level security;

create policy "movimentacoes_estoque_select_membro"
  on public.movimentacoes_estoque
  for select
  to authenticated
  using (
    exists (
      select 1 from public.estoque_itens ei
      where ei.id = movimentacoes_estoque.item_id
        and private.tem_acesso_propriedade(ei.propriedade_id)
    )
  );

create policy "movimentacoes_estoque_insert_membro"
  on public.movimentacoes_estoque
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.estoque_itens ei
      where ei.id = movimentacoes_estoque.item_id
        and private.tem_acesso_propriedade(ei.propriedade_id)
    )
  );

create policy "movimentacoes_estoque_update_membro"
  on public.movimentacoes_estoque
  for update
  to authenticated
  using (
    exists (
      select 1 from public.estoque_itens ei
      where ei.id = movimentacoes_estoque.item_id
        and private.tem_acesso_propriedade(ei.propriedade_id)
    )
  )
  with check (
    exists (
      select 1 from public.estoque_itens ei
      where ei.id = movimentacoes_estoque.item_id
        and private.tem_acesso_propriedade(ei.propriedade_id)
    )
  );

create policy "movimentacoes_estoque_delete_proprietario"
  on public.movimentacoes_estoque
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.estoque_itens ei
      where ei.id = movimentacoes_estoque.item_id
        and private.tem_acesso_propriedade(ei.propriedade_id, 'proprietario')
    )
  );

-- Recalcula quantidade_atual do item a partir da soma de todas as
-- movimentações (entrada soma, saída subtrai) e gera/resolve o alerta de
-- estoque mínimo. security definer porque quantidade_atual não é editável
-- pelo cliente (revoked na migration anterior); roda em qualquer INSERT,
-- UPDATE ou DELETE de movimentação, sempre recontando do zero para nunca
-- divergir por edição/exclusão de um lançamento antigo.
create or replace function public.recalcular_estoque()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item_id uuid := coalesce(new.item_id, old.item_id);
  v_saldo   numeric(12, 3);
  v_item    public.estoque_itens;
begin
  select coalesce(sum(case when tipo = 'entrada' then quantidade else -quantidade end), 0)
    into v_saldo
  from public.movimentacoes_estoque
  where item_id = v_item_id;

  update public.estoque_itens
     set quantidade_atual = v_saldo, atualizado_em = now()
   where id = v_item_id
  returning * into v_item;

  if v_saldo <= v_item.estoque_minimo and not exists (
       select 1 from public.alertas
       where tipo = 'estoque_baixo' and referencia_id = v_item_id and lido = false)
  then
    insert into public.alertas (propriedade_id, tipo, mensagem, nivel, referencia_tabela, referencia_id)
    values (
      v_item.propriedade_id,
      'estoque_baixo',
      'Estoque de "' || v_item.nome || '" atingiu o mínimo (' || v_saldo || ' ' || v_item.unidade || ').',
      'atencao',
      'estoque_itens',
      v_item.id
    );
  elsif v_saldo > v_item.estoque_minimo then
    update public.alertas
       set lido = true
     where tipo = 'estoque_baixo' and referencia_id = v_item_id and lido = false;
  end if;

  return coalesce(new, old);
end;
$$;

create trigger movimentacoes_estoque_recalcula
  after insert or update or delete on public.movimentacoes_estoque
  for each row execute function public.recalcular_estoque();

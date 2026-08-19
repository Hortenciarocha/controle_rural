create table public.estoque_itens (
  id                uuid primary key default gen_random_uuid(),
  propriedade_id    uuid not null references public.propriedades (id) on delete cascade,
  nome              text not null,
  categoria         text not null check (
    categoria in ('insumo', 'racao', 'fertilizante', 'medicamento', 'ferramenta', 'equipamento', 'outro')
  ),
  unidade           text not null,
  quantidade_atual  numeric(12, 3) not null default 0,
  estoque_minimo    numeric(12, 3) not null default 0 check (estoque_minimo >= 0),
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

create index estoque_itens_propriedade_id_idx on public.estoque_itens (propriedade_id);

create trigger estoque_itens_set_atualizado_em
  before update on public.estoque_itens
  for each row execute function public.set_atualizado_em();

alter table public.estoque_itens enable row level security;

create policy "estoque_itens_select_membro"
  on public.estoque_itens
  for select
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id));

create policy "estoque_itens_insert_membro"
  on public.estoque_itens
  for insert
  to authenticated
  with check (private.tem_acesso_propriedade(propriedade_id));

-- Cliente pode editar nome/categoria/unidade/estoque_minimo, mas nunca
-- quantidade_atual diretamente (só a trigger de movimentacoes_estoque
-- pode escrever nela — ver próxima migration). Isso é reforçado no nível
-- de coluna logo abaixo, não só pela policy de linha.
create policy "estoque_itens_update_membro"
  on public.estoque_itens
  for update
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id))
  with check (private.tem_acesso_propriedade(propriedade_id));

create policy "estoque_itens_delete_proprietario"
  on public.estoque_itens
  for delete
  to authenticated
  using (private.tem_acesso_propriedade(propriedade_id, 'proprietario'));

-- Defesa em profundidade (SEG-003 do PRD: "nunca confiar só na interface"):
-- revoga a permissão de UPDATE na coluna quantidade_atual do papel usado
-- pelo cliente autenticado. Só a função security definer da trigger
-- (que roda com privilégios do dono da função, não do cliente) consegue
-- alterar essa coluna.
revoke update (quantidade_atual) on public.estoque_itens from authenticated;

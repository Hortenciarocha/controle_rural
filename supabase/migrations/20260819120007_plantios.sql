create table public.plantios (
  id                  uuid primary key default gen_random_uuid(),
  talhao_id           uuid not null references public.talhoes (id) on delete cascade,
  cultura_id          uuid not null references public.culturas (id) on delete restrict,
  data_plantio        date not null default current_date,
  area_plantada       numeric(10, 2) not null check (area_plantada > 0),
  previsao_colheita   date,
  data_colheita       date,
  quantidade_colhida  numeric(12, 3) check (quantidade_colhida is null or quantidade_colhida >= 0),
  observacoes         text,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

create index plantios_talhao_id_idx on public.plantios (talhao_id);
create index plantios_cultura_id_idx on public.plantios (cultura_id);

create trigger plantios_set_atualizado_em
  before update on public.plantios
  for each row execute function public.set_atualizado_em();

-- Calcula previsao_colheita = data_plantio + ciclo_medio_dias da cultura,
-- só quando o usuário não informou uma previsão manual no INSERT (o PRD
-- pede previsão automática, mas editável). Roda só em INSERT: uma vez
-- definida, um UPDATE nunca sobrescreve o valor escolhido pelo usuário.
create or replace function public.calcular_previsao_colheita()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.previsao_colheita is null then
    select new.data_plantio + (c.ciclo_medio_dias || ' days')::interval
      into new.previsao_colheita
    from public.culturas c
    where c.id = new.cultura_id;
  end if;
  return new;
end;
$$;

create trigger plantios_calcula_previsao_colheita
  before insert on public.plantios
  for each row execute function public.calcular_previsao_colheita();

alter table public.plantios enable row level security;

-- Padrão para tabelas sem propriedade_id direto: sobe a FK (aqui, via
-- talhao_id) até achar a propriedade e reaplica a mesma função auxiliar.
-- Repetido em eventos_sanitarios/producao_animal (via animal_id) e
-- movimentacoes_estoque (via item_id).
create policy "plantios_select_membro"
  on public.plantios
  for select
  to authenticated
  using (
    exists (
      select 1 from public.talhoes t
      where t.id = plantios.talhao_id
        and private.tem_acesso_propriedade(t.propriedade_id)
    )
  );

create policy "plantios_insert_membro"
  on public.plantios
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.talhoes t
      where t.id = plantios.talhao_id
        and private.tem_acesso_propriedade(t.propriedade_id)
    )
  );

create policy "plantios_update_membro"
  on public.plantios
  for update
  to authenticated
  using (
    exists (
      select 1 from public.talhoes t
      where t.id = plantios.talhao_id
        and private.tem_acesso_propriedade(t.propriedade_id)
    )
  )
  with check (
    exists (
      select 1 from public.talhoes t
      where t.id = plantios.talhao_id
        and private.tem_acesso_propriedade(t.propriedade_id)
    )
  );

create policy "plantios_delete_proprietario"
  on public.plantios
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.talhoes t
      where t.id = plantios.talhao_id
        and private.tem_acesso_propriedade(t.propriedade_id, 'proprietario')
    )
  );

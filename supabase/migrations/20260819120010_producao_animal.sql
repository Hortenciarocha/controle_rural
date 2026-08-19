-- Schema pronto para a Versão 2 do PRD (produção de leite/ovos vinculada a
-- relatórios). Sem tela no MVP, mas a tabela já existe com RLS correta.
create table public.producao_animal (
  id         uuid primary key default gen_random_uuid(),
  animal_id  uuid not null references public.animais (id) on delete cascade,
  tipo       text not null,
  quantidade numeric(10, 2) not null check (quantidade >= 0),
  data       date not null default current_date,
  criado_em  timestamptz not null default now()
);

create index producao_animal_animal_id_idx on public.producao_animal (animal_id);

alter table public.producao_animal enable row level security;

create policy "producao_animal_select_membro"
  on public.producao_animal
  for select
  to authenticated
  using (
    exists (
      select 1 from public.animais a
      where a.id = producao_animal.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id)
    )
  );

create policy "producao_animal_insert_membro"
  on public.producao_animal
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.animais a
      where a.id = producao_animal.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id)
    )
  );

create policy "producao_animal_update_membro"
  on public.producao_animal
  for update
  to authenticated
  using (
    exists (
      select 1 from public.animais a
      where a.id = producao_animal.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id)
    )
  )
  with check (
    exists (
      select 1 from public.animais a
      where a.id = producao_animal.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id)
    )
  );

create policy "producao_animal_delete_proprietario"
  on public.producao_animal
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.animais a
      where a.id = producao_animal.animal_id
        and private.tem_acesso_propriedade(a.propriedade_id, 'proprietario')
    )
  );

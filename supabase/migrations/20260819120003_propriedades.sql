create table public.propriedades (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  localizacao   text not null,
  area_total    numeric(12, 2) not null check (area_total > 0),
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create trigger propriedades_set_atualizado_em
  before update on public.propriedades
  for each row execute function public.set_atualizado_em();

-- RLS habilitado aqui, mas as policies só entram na próxima migration
-- (dependem de propriedades_usuarios, que ainda não existe). Nesse intervalo
-- a tabela fica "fail-closed": ninguém acessa nada até as policies existirem.
alter table public.propriedades enable row level security;

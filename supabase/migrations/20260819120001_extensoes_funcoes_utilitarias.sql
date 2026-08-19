-- Schema não exposto pela Data API, para funções auxiliares "security definer"
-- que não devem ser chamáveis diretamente via PostgREST.
create schema if not exists private;

-- Trigger genérico: mantém "atualizado_em" sempre correto em updates.
create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

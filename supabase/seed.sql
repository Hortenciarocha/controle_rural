-- Catálogo global de culturas (propriedade_id null), para o produtor já
-- encontrar opções comuns ao cadastrar o primeiro plantio.
insert into public.culturas (nome, ciclo_medio_dias, unidade_producao) values
  ('Milho',        120, 'sacas'),
  ('Soja',         110, 'sacas'),
  ('Feijão',        90, 'sacas'),
  ('Café',         240, 'sacas'),
  ('Cana-de-açúcar', 365, 'toneladas'),
  ('Arroz',         120, 'sacas'),
  ('Mandioca',      300, 'toneladas'),
  ('Hortaliças',     60, 'kg')
on conflict (nome) where propriedade_id is null do nothing;

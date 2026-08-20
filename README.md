# Controle Rural Simples

Sistema web para pequenos e médios produtores rurais controlarem propriedade, plantações, animais, estoque, financeiro e tarefas. Ver [PRD_Controle_Rural_Simples.md](./PRD_Controle_Rural_Simples.md) para o escopo completo do produto.

Este repositório implementa o **MVP** (Seção 13 do PRD): autenticação, propriedade/talhões, plantações, animais, estoque, financeiro, atividades e dashboard.

## Stack

- **Front-end:** React + Vite + TypeScript + Tailwind CSS, falando direto com o Supabase (`@supabase/supabase-js`) para autenticação e dados, com Row Level Security garantindo isolamento por propriedade.
- **Back-end:** Node.js + Express — esqueleto mínimo neste MVP, reservado para lógica sensível futura (ex.: IA, Versão 2/3 do PRD).
- **Banco/Auth:** Supabase (PostgreSQL gerenciado + Auth + RLS).

## Pré-requisitos

- Node.js 22+ (já instalado nesta máquina).
- Uma conta gratuita em [supabase.com](https://supabase.com).

## 1. Criar o projeto no Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um novo projeto (nome, senha do banco, região). Aguarde ~1–2 min de provisionamento.
2. Em **Project Settings → API Keys**, copie a **anon public key**. A **Project URL** segue sempre o padrão `https://<project-id>.supabase.co` (o `project-id` aparece em **Project Settings → General**).
3. Em **Authentication → Providers**, confirme que "Email" está habilitado.
4. Por padrão o Supabase exige **confirmação por e-mail** antes do primeiro login funcionar. Para testar mais rápido em desenvolvimento, desative essa opção em **Authentication → Sign In / Providers** (procure por "Confirm email"). Em produção, deixe habilitada.

⚠️ Nunca copie a **service_role key** para o front-end nem para o `.env` do `frontend/` — ela dá acesso total ao banco, ignorando o RLS. Ela só seria necessária no `backend/`, e mesmo assim apenas quando a Fase de IA for implementada.

## 2. Aplicar o schema do banco

As migrations estão em `supabase/migrations/` (15 arquivos, uma por tabela/conceito) e o catálogo inicial de culturas em `supabase/seed.sql`.

**Opção A — SQL Editor do painel Supabase (mais simples, sem instalar nada):**
Copie e execute o conteúdo de cada arquivo de `supabase/migrations/`, em ordem (pelo nome, que já é cronológico), e por último `supabase/seed.sql`.

**Opção B — Supabase CLI:**
```bash
npx supabase login
npx supabase link --project-ref <seu-project-ref>
npx supabase db push
```

Depois de aplicar o schema, gere os tipos TypeScript reais (substituindo o arquivo escrito à mão):
```bash
npx supabase gen types typescript --project-id <seu-project-ref> > frontend/src/types/database.types.ts
```

## 3. Configurar variáveis de ambiente

```bash
cp frontend/.env.example frontend/.env
```
Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os valores copiados no passo 1.

(O `backend/.env.example` só é necessário quando a Fase de IA for implementada — fora do escopo deste MVP.)

## 4. Instalar dependências e rodar

Na raiz do repositório:
```bash
npm install
npm run dev:frontend   # http://localhost:5173
npm run dev:backend    # http://localhost:3333 (opcional neste MVP)
```

### Testando o front-end

Abra `http://localhost:5173`, crie uma conta, faça login, crie uma propriedade e navegue pelos módulos (Propriedade, Plantações, Animais, Estoque, Financeiro, Atividades, Painel).

### Testando o backend

O back-end neste MVP é só um esqueleto — não tem CRUD nem regra de negócio (isso é todo feito pelo front-end direto no Supabase, com RLS). Ele existe apenas para já deixar a estrutura pronta para a Fase de IA (Versão 2/3 do PRD). Por isso, só há duas rotas:

- `GET http://localhost:3333/health` → deve responder `{"status":"ok"}`.
- `GET http://localhost:3333/ia` → deve responder `501` com uma mensagem dizendo que a IA ainda não foi implementada (esperado — é um placeholder).

Acessar `http://localhost:3333/` (a raiz) mostra **"Cannot GET /"** — isso é o comportamento padrão do Express para uma rota não definida, não é um erro; nenhuma rota foi criada em `/` porque o front-end nunca precisa chamá-la.

## Estrutura

```
frontend/     React + Vite + TypeScript (todo o CRUD do MVP)
backend/      Express — esqueleto mínimo (/health, /ia reservado)
supabase/     migrations SQL + seed.sql
```

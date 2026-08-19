import { Router } from 'express'

// Reservado para a Fase de IA do PRD (Seção 6 — Versão 2/3), fora do escopo
// deste MVP. Quando implementado, este router chamará a API da Anthropic
// a partir do back-end (nunca do front-end, para não expor a chave de API).
export const iaRouter = Router()

iaRouter.use((_req, res) => {
  res.status(501).json({ error: 'Recurso de IA ainda não implementado (Versão 2/3).' })
})

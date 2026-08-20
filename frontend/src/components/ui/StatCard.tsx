import type { ReactNode } from 'react'
import { Card } from './Card'

type Status = 'neutro' | 'ok' | 'atencao' | 'urgente'

const corPorStatus: Record<Status, string> = {
  neutro: 'text-neutral-900',
  ok: 'text-primary-700',
  atencao: 'text-warning-700',
  urgente: 'text-danger-700',
}

const corBarraPorStatus: Record<Status, string> = {
  neutro: 'bg-neutral-300',
  ok: 'bg-primary-500',
  atencao: 'bg-warning-500',
  urgente: 'bg-danger-500',
}

interface StatCardProps {
  titulo: string
  valor: string
  status?: Status
  icone?: ReactNode
  legenda?: string
}

export function StatCard({ titulo, valor, status = 'neutro', icone, legenda }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden pl-5">
      <span className={`absolute inset-y-0 left-0 w-1 ${corBarraPorStatus[status]}`} aria-hidden="true" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">{titulo}</span>
        {icone}
      </div>
      <p className={`mt-1 font-display text-3xl font-semibold tabular-nums ${corPorStatus[status]}`}>{valor}</p>
      {legenda && <p className="mt-1 text-xs text-neutral-500">{legenda}</p>}
    </Card>
  )
}

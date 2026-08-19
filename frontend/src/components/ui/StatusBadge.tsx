import type { ReactNode } from 'react'

type Status = 'ok' | 'atencao' | 'urgente' | 'neutro'

const estilos: Record<Status, string> = {
  ok: 'bg-primary-100 text-primary-800',
  atencao: 'bg-warning-100 text-warning-700',
  urgente: 'bg-danger-100 text-danger-700',
  neutro: 'bg-neutral-100 text-neutral-700',
}

export function StatusBadge({ status, children }: { status: Status; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${estilos[status]}`}>
      {children}
    </span>
  )
}

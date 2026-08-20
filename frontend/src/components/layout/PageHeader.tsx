import type { ReactNode } from 'react'

export function PageHeader({ titulo, acao }: { titulo: string; acao?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h1 className="font-display text-2xl font-semibold text-neutral-900">{titulo}</h1>
      {acao}
    </div>
  )
}

import type { ReactNode } from 'react'

interface EmptyStateProps {
  titulo: string
  descricao?: string
  acao?: ReactNode
  icone?: ReactNode
}

export function EmptyState({ titulo, descricao, acao, icone }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center">
      {icone && <div className="mb-3 text-neutral-400">{icone}</div>}
      <p className="font-medium text-neutral-800">{titulo}</p>
      {descricao && <p className="mt-1 max-w-sm text-sm text-neutral-500">{descricao}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  )
}

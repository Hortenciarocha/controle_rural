import type { ReactNode } from 'react'

interface EmptyStateProps {
  titulo: string
  descricao?: string
  acao?: ReactNode
  icone?: ReactNode
}

export function EmptyState({ titulo, descricao, acao, icone }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/60 px-6 py-14 text-center">
      {icone && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          {icone}
        </div>
      )}
      <p className="font-display text-base font-semibold text-neutral-800">{titulo}</p>
      {descricao && <p className="mt-1 max-w-sm text-sm text-neutral-500">{descricao}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  )
}

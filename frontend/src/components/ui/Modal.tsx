import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  titulo: string
  aberto: boolean
  aoFechar: () => void
  children: ReactNode
}

export function Modal({ titulo, aberto, aoFechar, children }: ModalProps) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">{titulo}</h2>
          <button
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

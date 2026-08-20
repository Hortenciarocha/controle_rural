import type { ReactNode } from 'react'
import { Sprout } from 'lucide-react'

export function AuthShell({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-neutral-50">
      <div className="textura-sulcos-clara relative bg-primary-700 px-4 pb-16 pt-12 text-center">
        <div className="flex items-center justify-center gap-2 text-white">
          <Sprout size={22} strokeWidth={2.25} />
          <span className="font-display text-lg font-medium tracking-tight">Controle Rural</span>
        </div>
      </div>

      <div className="relative mx-auto -mt-10 w-full max-w-sm px-4 pb-12">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-lg shadow-neutral-900/5">
          <h1 className="font-display text-xl font-semibold text-neutral-900">{titulo}</h1>
          <p className="mt-1 mb-6 text-sm text-neutral-500">{subtitulo}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { Sprout } from 'lucide-react'

export function AuthShell({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600">
            <Sprout className="text-white" size={26} />
          </span>
          <h1 className="text-xl font-semibold text-neutral-900">{titulo}</h1>
          <p className="mt-1 text-sm text-neutral-500">{subtitulo}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

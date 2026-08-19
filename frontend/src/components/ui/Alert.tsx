import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'

type Tipo = 'info' | 'sucesso' | 'atencao' | 'erro'

const config: Record<Tipo, { cor: string; icone: ReactNode }> = {
  info: { cor: 'bg-neutral-100 text-neutral-800', icone: <Info size={18} /> },
  sucesso: { cor: 'bg-primary-50 text-primary-800', icone: <CheckCircle2 size={18} /> },
  atencao: { cor: 'bg-warning-50 text-warning-700', icone: <AlertTriangle size={18} /> },
  erro: { cor: 'bg-danger-50 text-danger-700', icone: <XCircle size={18} /> },
}

export function Alert({ tipo = 'info', children }: { tipo?: Tipo; children: ReactNode }) {
  const { cor, icone } = config[tipo]
  return (
    <div className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm ${cor}`} role="alert">
      <span className="mt-0.5 shrink-0">{icone}</span>
      <span>{children}</span>
    </div>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primaria' | 'secundaria' | 'perigo' | 'fantasma'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  carregando?: boolean
  children: ReactNode
}

const estilosPorVariante: Record<Variante, string> = {
  primaria: 'bg-primary-600 text-white shadow-sm shadow-primary-900/10 hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300 disabled:shadow-none',
  secundaria: 'bg-white text-neutral-800 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100',
  perigo: 'bg-danger-600 text-white shadow-sm shadow-danger-900/10 hover:bg-danger-700 active:bg-danger-800 disabled:bg-danger-300 disabled:shadow-none',
  fantasma: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
}

export function Button({
  variante = 'primaria',
  carregando = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || carregando}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-base font-medium transition-[background-color,box-shadow] duration-150 disabled:cursor-not-allowed ${estilosPorVariante[variante]} ${className}`}
      {...props}
    >
      {carregando && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}

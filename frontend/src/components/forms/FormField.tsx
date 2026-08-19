import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  erro?: string
  opcional?: boolean
  children: ReactNode
}

export function FormField({ label, erro, opcional, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
        {opcional && <span className="ml-1 font-normal text-neutral-400">(opcional)</span>}
      </label>
      {children}
      {erro && <p className="mt-1 text-xs text-danger-600">{erro}</p>}
    </div>
  )
}

export const inputClassName =
  'w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100'

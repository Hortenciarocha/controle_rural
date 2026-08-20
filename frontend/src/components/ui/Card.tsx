import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-neutral-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(32,31,26,0.04),0_1px_8px_rgba(32,31,26,0.04)] ${className}`}>
      {children}
    </div>
  )
}

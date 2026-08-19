import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PropriedadeSwitcher } from './PropriedadeSwitcher'

export function TopBar() {
  const { sair } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur">
      <PropriedadeSwitcher />
      <button
        onClick={sair}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100"
      >
        <LogOut size={16} />
        Sair
      </button>
    </header>
  )
}

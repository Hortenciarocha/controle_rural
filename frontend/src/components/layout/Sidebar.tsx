import { NavLink } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { navItens } from './navItens'

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-neutral-200 bg-white md:flex md:flex-col">
      <div className="flex items-center gap-2 px-5 py-5 text-primary-700">
        <Sprout size={22} strokeWidth={2.25} />
        <span className="font-display text-lg font-medium tracking-tight text-neutral-900">Controle Rural</span>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {navItens.map(({ rotulo, caminho, icone: Icone }) => (
          <NavLink
            key={caminho}
            to={caminho}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary-600" aria-hidden="true" />
                )}
                <Icone size={18} />
                {rotulo}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

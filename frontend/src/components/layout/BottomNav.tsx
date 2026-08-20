import { NavLink } from 'react-router-dom'
import { navItens } from './navItens'

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-neutral-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] md:hidden">
      {navItens.map(({ rotulo, caminho, icone: Icone }) => (
        <NavLink
          key={caminho}
          to={caminho}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
              isActive ? 'text-primary-700' : 'text-neutral-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-primary-100' : ''
                }`}
              >
                <Icone size={19} />
              </span>
              <span className="leading-tight">{rotulo}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

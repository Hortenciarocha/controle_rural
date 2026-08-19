import {
  LayoutDashboard,
  MapPin,
  Sprout,
  PawPrint,
  Package,
  Wallet,
  CalendarCheck,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  rotulo: string
  caminho: string
  icone: LucideIcon
}

export const navItens: NavItem[] = [
  { rotulo: 'Painel', caminho: 'dashboard', icone: LayoutDashboard },
  { rotulo: 'Propriedade', caminho: 'propriedade', icone: MapPin },
  { rotulo: 'Plantações', caminho: 'plantacoes', icone: Sprout },
  { rotulo: 'Animais', caminho: 'animais', icone: PawPrint },
  { rotulo: 'Estoque', caminho: 'estoque', icone: Package },
  { rotulo: 'Financeiro', caminho: 'financeiro', icone: Wallet },
  { rotulo: 'Atividades', caminho: 'atividades', icone: CalendarCheck },
]

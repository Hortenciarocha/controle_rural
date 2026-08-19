import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { usePropriedadeAtiva } from '@/contexts/PropriedadeContext'
import { usePropriedadesDoUsuario } from '@/contexts/PropriedadeContext'

export function PropriedadeSwitcher() {
  const { propriedade, propriedadeId } = usePropriedadeAtiva()
  const { data: propriedades } = usePropriedadesDoUsuario()
  const navigate = useNavigate()

  if (!propriedades || propriedades.length <= 1) {
    return <span className="truncate font-medium text-neutral-900">{propriedade?.nome ?? '...'}</span>
  }

  return (
    <div className="relative">
      <select
        value={propriedadeId}
        onChange={(evento) => navigate(`/p/${evento.target.value}/dashboard`)}
        className="appearance-none rounded-lg border border-neutral-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-neutral-900"
      >
        {propriedades.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
    </div>
  )
}

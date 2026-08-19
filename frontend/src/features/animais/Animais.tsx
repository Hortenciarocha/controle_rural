import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, PawPrint } from 'lucide-react'
import { usePropriedadeAtiva } from '@/contexts/PropriedadeContext'
import { useAnimais } from '@/hooks/useAnimais'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'
import { NovoAnimalModal } from './NovoAnimalModal'

export function Animais() {
  const { propriedadeId } = usePropriedadeAtiva()
  const { data: animais, isLoading } = useAnimais(propriedadeId)
  const [modalAberto, setModalAberto] = useState(false)
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        titulo="Animais"
        acao={
          <Button onClick={() => setModalAberto(true)}>
            <Plus size={16} /> Novo animal
          </Button>
        }
      />

      {isLoading ? (
        <PageLoader />
      ) : animais && animais.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {animais.map((animal) => (
            <Card key={animal.id} className="cursor-pointer hover:border-primary-300">
              <button className="w-full text-left" onClick={() => navigate(`../animais/${animal.id}`)}>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <PawPrint size={18} />
                  </span>
                  <div>
                    <p className="font-medium text-neutral-900">{animal.identificacao || animal.especie}</p>
                    <p className="text-sm text-neutral-500">
                      {animal.especie}
                      {animal.raca ? ` · ${animal.raca}` : ''}
                    </p>
                  </div>
                </div>
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icone={<PawPrint size={32} />}
          titulo="Nenhum animal cadastrado"
          descricao="Cadastre seus animais para acompanhar vacinas e tratamentos."
        />
      )}

      <NovoAnimalModal propriedadeId={propriedadeId} aberto={modalAberto} aoFechar={() => setModalAberto(false)} />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plus, Sprout, LogOut } from 'lucide-react'
import { usePropriedadesDoUsuario } from '@/contexts/PropriedadeContext'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/PageLoader'
import { EmptyState } from '@/components/ui/EmptyState'
import { NovaPropriedadeModal } from './NovaPropriedadeModal'

export function SelecionarPropriedade() {
  const { data: propriedades, isLoading } = usePropriedadesDoUsuario()
  const { sair } = useAuth()
  const navigate = useNavigate()
  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    if (propriedades?.length === 1) {
      navigate(`/p/${propriedades[0].id}/dashboard`, { replace: true })
    }
  }, [propriedades, navigate])

  if (isLoading) return <PageLoader />

  const temMultiplas = (propriedades?.length ?? 0) > 1
  const semPropriedades = (propriedades?.length ?? 0) === 0

  if (!temMultiplas && !semPropriedades) return <PageLoader />

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="text-primary-600" size={24} />
          <h1 className="text-lg font-semibold text-neutral-900">Suas propriedades</h1>
        </div>
        <button
          onClick={sair}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>

      {semPropriedades ? (
        <EmptyState
          icone={<MapPin size={32} />}
          titulo="Nenhuma propriedade cadastrada"
          descricao="Cadastre sua propriedade para começar a usar o sistema."
          acao={
            <Button onClick={() => setModalAberto(true)}>
              <Plus size={18} /> Cadastrar propriedade
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {propriedades!.map((p) => (
              <Card key={p.id} className="cursor-pointer hover:border-primary-300" >
                <button
                  className="flex w-full items-center gap-3 text-left"
                  onClick={() => navigate(`/p/${p.id}/dashboard`)}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <MapPin size={20} />
                  </span>
                  <div>
                    <p className="font-medium text-neutral-900">{p.nome}</p>
                    <p className="text-sm text-neutral-500">{p.localizacao}</p>
                  </div>
                </button>
              </Card>
            ))}
          </div>
          <Button variante="secundaria" className="mt-4" onClick={() => setModalAberto(true)}>
            <Plus size={18} /> Nova propriedade
          </Button>
        </>
      )}

      <NovaPropriedadeModal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        aoCriar={(id) => navigate(`/p/${id}/dashboard`)}
      />
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Syringe, Stethoscope, FileText } from 'lucide-react'
import { useAnimal, useEventosSanitarios } from '@/hooks/useAnimais'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'
import { NovoEventoSanitarioModal } from './NovoEventoSanitarioModal'
import { formatarData } from '@/lib/format'

const iconePorTipo = { vacina: Syringe, tratamento: Stethoscope, outro: FileText }

export function FichaAnimal() {
  const { animalId } = useParams<{ animalId: string }>()
  const navigate = useNavigate()
  const { data: animal, isLoading: carregandoAnimal } = useAnimal(animalId!)
  const { data: eventos, isLoading: carregandoEventos } = useEventosSanitarios(animalId!)
  const [modalAberto, setModalAberto] = useState(false)

  if (carregandoAnimal) return <PageLoader />
  if (!animal) return null

  return (
    <div>
      <button
        onClick={() => navigate('..')}
        className="mb-3 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      <Card className="mb-6">
        <h1 className="text-lg font-semibold text-neutral-900">{animal.identificacao || animal.especie}</h1>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-neutral-400">Espécie</dt>
            <dd className="text-neutral-800">{animal.especie}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Raça</dt>
            <dd className="text-neutral-800">{animal.raca || '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Sexo</dt>
            <dd className="text-neutral-800">{animal.sexo === 'macho' ? 'Macho' : animal.sexo === 'femea' ? 'Fêmea' : '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Nascimento</dt>
            <dd className="text-neutral-800">{animal.data_nascimento ? formatarData(animal.data_nascimento) : '—'}</dd>
          </div>
          <div>
            <dt className="text-neutral-400">Peso</dt>
            <dd className="text-neutral-800">{animal.peso ? `${animal.peso} kg` : '—'}</dd>
          </div>
        </dl>
      </Card>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium text-neutral-900">Histórico sanitário</h2>
        <Button variante="secundaria" onClick={() => setModalAberto(true)}>
          <Plus size={16} /> Novo evento
        </Button>
      </div>

      {carregandoEventos ? (
        <PageLoader />
      ) : eventos && eventos.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {eventos.map((evento) => {
            const Icone = iconePorTipo[evento.tipo]
            return (
              <li key={evento.id}>
                <Card>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <Icone size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900">{evento.descricao}</p>
                      <p className="text-sm text-neutral-500">
                        {formatarData(evento.data)}
                        {evento.responsavel ? ` · ${evento.responsavel}` : ''}
                      </p>
                      {evento.proxima_data && (
                        <p className="mt-1 text-xs font-medium text-warning-700">
                          Próximo retorno: {formatarData(evento.proxima_data)}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </li>
            )
          })}
        </ol>
      ) : (
        <EmptyState titulo="Nenhum evento registrado" descricao="Registre vacinas e tratamentos deste animal." />
      )}

      <NovoEventoSanitarioModal animalId={animalId!} aberto={modalAberto} aoFechar={() => setModalAberto(false)} />
    </div>
  )
}

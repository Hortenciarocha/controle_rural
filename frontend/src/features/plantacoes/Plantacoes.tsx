import { useState } from 'react'
import { Plus, Sprout } from 'lucide-react'
import { usePropriedadeAtiva } from '@/contexts/PropriedadeContext'
import { usePlantios, type PlantioComRelacoes } from '@/hooks/usePlantios'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'
import { NovaCulturaModal } from './NovaCulturaModal'
import { NovoPlantioModal } from './NovoPlantioModal'
import { RegistrarColheitaModal } from './RegistrarColheitaModal'
import { formatarData as formatarDataBase } from '@/lib/format'

function formatarData(data: string | null) {
  if (!data) return '—'
  return formatarDataBase(data)
}

function produtividade(plantio: PlantioComRelacoes) {
  if (plantio.quantidade_colhida == null || plantio.area_plantada === 0) return null
  return (plantio.quantidade_colhida / plantio.area_plantada).toFixed(2)
}

export function Plantacoes() {
  const { propriedadeId } = usePropriedadeAtiva()
  const { data: plantios, isLoading } = usePlantios(propriedadeId)
  const [modalCulturaAberto, setModalCulturaAberto] = useState(false)
  const [modalPlantioAberto, setModalPlantioAberto] = useState(false)
  const [plantioColheita, setPlantioColheita] = useState<PlantioComRelacoes | null>(null)

  return (
    <div>
      <PageHeader
        titulo="Plantações"
        acao={
          <div className="flex gap-2">
            <Button variante="secundaria" onClick={() => setModalCulturaAberto(true)}>
              Nova cultura
            </Button>
            <Button onClick={() => setModalPlantioAberto(true)}>
              <Plus size={16} /> Novo plantio
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <PageLoader />
      ) : plantios && plantios.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {plantios.map((plantio) => {
            const colhido = plantio.data_colheita != null
            const prod = produtividade(plantio)
            return (
              <Card key={plantio.id}>
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Sprout size={18} className="text-primary-600" />
                    <p className="font-medium text-neutral-900">{plantio.culturas?.nome ?? 'Cultura'}</p>
                  </div>
                  <StatusBadge status={colhido ? 'ok' : 'neutro'}>{colhido ? 'Colhido' : 'Em andamento'}</StatusBadge>
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-neutral-600">
                  <dt className="text-neutral-400">Talhão</dt>
                  <dd>{plantio.talhoes.nome}</dd>
                  <dt className="text-neutral-400">Plantio</dt>
                  <dd>{formatarData(plantio.data_plantio)}</dd>
                  <dt className="text-neutral-400">Área</dt>
                  <dd>{plantio.area_plantada} ha</dd>
                  <dt className="text-neutral-400">Previsão colheita</dt>
                  <dd>{formatarData(plantio.previsao_colheita)}</dd>
                  {colhido && (
                    <>
                      <dt className="text-neutral-400">Colhido</dt>
                      <dd>
                        {plantio.quantidade_colhida} {plantio.culturas?.unidade_producao}
                      </dd>
                      {prod && (
                        <>
                          <dt className="text-neutral-400">Produtividade</dt>
                          <dd>
                            {prod} {plantio.culturas?.unidade_producao}/ha
                          </dd>
                        </>
                      )}
                    </>
                  )}
                </dl>
                {!colhido && (
                  <Button
                    variante="secundaria"
                    className="mt-3 w-full"
                    onClick={() => setPlantioColheita(plantio)}
                  >
                    Registrar colheita
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icone={<Sprout size={32} />}
          titulo="Nenhum plantio registrado"
          descricao="Registre seu primeiro plantio para acompanhar a safra."
        />
      )}

      <NovaCulturaModal
        propriedadeId={propriedadeId}
        aberto={modalCulturaAberto}
        aoFechar={() => setModalCulturaAberto(false)}
      />
      <NovoPlantioModal
        propriedadeId={propriedadeId}
        aberto={modalPlantioAberto}
        aoFechar={() => setModalPlantioAberto(false)}
      />
      <RegistrarColheitaModal
        propriedadeId={propriedadeId}
        plantio={plantioColheita}
        aoFechar={() => setPlantioColheita(null)}
      />
    </div>
  )
}

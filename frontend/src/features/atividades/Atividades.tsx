import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, CalendarCheck } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { usePropriedadeAtiva } from '@/contexts/PropriedadeContext'
import { useAtividades } from '@/hooks/useAtividades'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'
import { formatarData } from '@/lib/format'
import { NovaAtividadeModal } from './NovaAtividadeModal'
import type { Database, StatusAtividade } from '@/types/database.types'

type Atividade = Database['public']['Tables']['atividades']['Row']

const rotuloStatus: Record<StatusAtividade, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

const statusBadge: Record<StatusAtividade, 'atencao' | 'neutro' | 'ok'> = {
  pendente: 'atencao',
  em_andamento: 'neutro',
  concluida: 'ok',
}

export function Atividades() {
  const { propriedadeId } = usePropriedadeAtiva()
  const { data: atividades, isLoading } = useAtividades(propriedadeId)
  const [modalAberto, setModalAberto] = useState(false)
  const queryClient = useQueryClient()

  const atualizarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StatusAtividade }) => {
      const { error } = await supabase.from('atividades').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'atividades'] }),
  })

  const hoje = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <PageHeader
        titulo="Atividades"
        acao={
          <Button onClick={() => setModalAberto(true)}>
            <Plus size={16} /> Nova atividade
          </Button>
        }
      />

      {isLoading ? (
        <PageLoader />
      ) : atividades && atividades.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {atividades.map((atividade: Atividade) => {
            const atrasada = atividade.status !== 'concluida' && atividade.data_prevista < hoje
            return (
              <li key={atividade.id}>
                <Card>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-900">{atividade.titulo}</p>
                      <p className="text-sm text-neutral-500">
                        {formatarData(atividade.data_prevista)}
                        {atrasada && <span className="ml-2 font-medium text-danger-600">atrasada</span>}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={atrasada ? 'urgente' : statusBadge[atividade.status]}>
                        {rotuloStatus[atividade.status]}
                      </StatusBadge>
                      <select
                        value={atividade.status}
                        onChange={(e) =>
                          atualizarStatus.mutate({ id: atividade.id, status: e.target.value as StatusAtividade })
                        }
                        className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em andamento</option>
                        <option value="concluida">Concluída</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyState
          icone={<CalendarCheck size={32} />}
          titulo="Nenhuma atividade cadastrada"
          descricao="Crie atividades para não esquecer tarefas importantes."
        />
      )}

      <NovaAtividadeModal propriedadeId={propriedadeId} aberto={modalAberto} aoFechar={() => setModalAberto(false)} />
    </div>
  )
}

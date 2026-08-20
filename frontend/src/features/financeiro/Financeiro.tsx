import { useState } from 'react'
import { Plus, Wallet } from 'lucide-react'
import { usePropriedadeAtiva } from '@/contexts/PropriedadeContext'
import { useLancamentos, primeiroDiaDoMes, ultimoDiaDoMes } from '@/hooks/useFinanceiro'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { DataTable, type Coluna } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatarMoeda, formatarData } from '@/lib/format'
import { NovoLancamentoModal } from './NovoLancamentoModal'
import type { Database } from '@/types/database.types'

type Lancamento = Database['public']['Tables']['financeiro_lancamentos']['Row']

export function Financeiro() {
  const { propriedadeId } = usePropriedadeAtiva()
  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes())
  const [dataFim, setDataFim] = useState(ultimoDiaDoMes())
  const [modalAberto, setModalAberto] = useState(false)
  const { data: lancamentos, isLoading } = useLancamentos(propriedadeId, dataInicio, dataFim)

  const receita = lancamentos?.filter((l) => l.tipo === 'receita').reduce((soma, l) => soma + l.valor, 0) ?? 0
  const despesa = lancamentos?.filter((l) => l.tipo === 'despesa').reduce((soma, l) => soma + l.valor, 0) ?? 0
  const lucro = receita - despesa

  const colunas: Coluna<Lancamento>[] = [
    { cabecalho: 'Data', render: (l) => formatarData(l.data) },
    { cabecalho: 'Categoria', render: (l) => l.categoria },
    {
      cabecalho: 'Tipo',
      render: (l) => <StatusBadge status={l.tipo === 'receita' ? 'ok' : 'urgente'}>{l.tipo === 'receita' ? 'Receita' : 'Despesa'}</StatusBadge>,
    },
    {
      cabecalho: 'Valor',
      className: 'text-right font-medium tabular-nums',
      render: (l) => (l.tipo === 'receita' ? '+ ' : '− ') + formatarMoeda(l.valor),
    },
  ]

  return (
    <div>
      <PageHeader
        titulo="Financeiro"
        acao={
          <Button onClick={() => setModalAberto(true)}>
            <Plus size={16} /> Novo lançamento
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-sm text-neutral-600">
          De
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="ml-2 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-sm text-neutral-600">
          Até
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="ml-2 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard titulo="Receita" valor={formatarMoeda(receita)} status="ok" />
        <StatCard titulo="Despesa" valor={formatarMoeda(despesa)} status="urgente" />
        <StatCard titulo="Lucro" valor={formatarMoeda(lucro)} status={lucro >= 0 ? 'ok' : 'urgente'} />
      </div>

      {isLoading ? (
        <PageLoader />
      ) : lancamentos && lancamentos.length > 0 ? (
        <DataTable itens={lancamentos} colunas={colunas} chave={(l) => l.id} />
      ) : (
        <EmptyState
          icone={<Wallet size={32} />}
          titulo="Nenhum lançamento no período"
          descricao="Registre receitas e despesas para acompanhar seu resultado."
        />
      )}

      <NovoLancamentoModal propriedadeId={propriedadeId} aberto={modalAberto} aoFechar={() => setModalAberto(false)} />
    </div>
  )
}

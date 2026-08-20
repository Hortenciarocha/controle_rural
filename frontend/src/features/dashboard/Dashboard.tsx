import '@/lib/chartSetup'
import { Bar } from 'react-chartjs-2'
import { Link } from 'react-router-dom'
import { AlertTriangle, PawPrint, Sprout, Package, CalendarClock } from 'lucide-react'
import { usePropriedadeAtiva } from '@/contexts/PropriedadeContext'
import {
  useResumoFinanceiroMes,
  useSerieFinanceiraMensal,
  useAlertasAbertos,
  useResumoAnimais,
  useResumoPlantacoes,
  useAtividadesPendentesDashboard,
  useAlertasEstoqueBaixo,
} from '@/hooks/useDashboard'
import { StatCard } from '@/components/ui/StatCard'
import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'
import { formatarMoeda, formatarData } from '@/lib/format'

const coresGrafico = { receita: '#4c7e35', despesa: '#bf4a34' }

const dataFormatada = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const dataPorExtenso = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)

export function Dashboard() {
  const { propriedade, propriedadeId, carregando } = usePropriedadeAtiva()
  const { data: financeiroMes, isLoading: carregandoFinanceiro } = useResumoFinanceiroMes(propriedadeId)
  const { data: serieFinanceira } = useSerieFinanceiraMensal(propriedadeId)
  const { data: alertas } = useAlertasAbertos(propriedadeId)
  const { data: resumoAnimais } = useResumoAnimais(propriedadeId)
  const { data: resumoPlantacoes } = useResumoPlantacoes(propriedadeId)
  const { data: resumoAtividades } = useAtividadesPendentesDashboard(propriedadeId)
  const { data: estoqueBaixo } = useAlertasEstoqueBaixo(propriedadeId)

  if (carregando) return <PageLoader />

  return (
    <div>
      <div className="textura-sulcos relative mb-5 overflow-hidden rounded-2xl bg-primary-700 px-5 py-6 text-white">
        <p className="text-sm text-primary-100">{dataPorExtenso}</p>
        <h1 className="font-display text-2xl font-semibold">{propriedade ? propriedade.nome : 'Painel'}</h1>
      </div>

      {carregandoFinanceiro ? (
        <PageLoader />
      ) : (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard titulo="Receita (mês)" valor={formatarMoeda(financeiroMes?.receita ?? 0)} status="ok" />
          <StatCard titulo="Despesa (mês)" valor={formatarMoeda(financeiroMes?.despesa ?? 0)} status="urgente" />
          <StatCard
            titulo="Lucro (mês)"
            valor={formatarMoeda(financeiroMes?.lucro ?? 0)}
            status={(financeiroMes?.lucro ?? 0) >= 0 ? 'ok' : 'urgente'}
          />
        </div>
      )}

      {alertas && alertas.length > 0 && (
        <div className="mb-5 flex flex-col gap-2">
          {alertas.slice(0, 5).map((a) => (
            <Alert key={a.id} tipo={a.nivel === 'urgente' ? 'erro' : a.nivel === 'atencao' ? 'atencao' : 'info'}>
              {a.mensagem}
            </Alert>
          ))}
        </div>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Card>
          <div className="mb-1 flex items-center gap-2 text-primary-700">
            <Sprout size={18} />
            <span className="text-sm font-medium">Plantações</span>
          </div>
          <p className="text-lg font-semibold text-neutral-900">{resumoPlantacoes?.plantiosEmAndamento ?? 0} em andamento</p>
          <p className="text-sm text-neutral-500">{(resumoPlantacoes?.areaEmAndamento ?? 0).toFixed(1)} ha plantados</p>
        </Card>
        <Card>
          <div className="mb-1 flex items-center gap-2 text-primary-700">
            <PawPrint size={18} />
            <span className="text-sm font-medium">Animais</span>
          </div>
          <p className="text-lg font-semibold text-neutral-900">{resumoAnimais?.totalAnimais ?? 0} cadastrados</p>
          <p className="text-sm text-neutral-500">
            {resumoAnimais?.vacinasProximas.length ?? 0} evento(s) sanitário(s) nos próximos 7 dias
          </p>
        </Card>
        <Card>
          <div className="mb-1 flex items-center gap-2 text-primary-700">
            <Package size={18} />
            <span className="text-sm font-medium">Estoque</span>
          </div>
          <p className="text-lg font-semibold text-neutral-900">{estoqueBaixo?.length ?? 0} item(ns) em alerta</p>
          <p className="text-sm text-neutral-500">abaixo do estoque mínimo</p>
        </Card>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-medium text-neutral-900">
            <CalendarClock size={18} className="text-primary-600" /> Atividades pendentes
          </h2>
          {resumoAtividades?.atividades.length ? (
            <ul className="flex flex-col gap-2">
              {resumoAtividades.atividades.map((a) => {
                const hoje = new Date().toISOString().slice(0, 10)
                const atrasada = a.data_prevista < hoje
                return (
                  <li key={a.id} className="flex items-center justify-between text-sm">
                    <span className="truncate text-neutral-700">{a.titulo}</span>
                    <span className={`shrink-0 ${atrasada ? 'font-medium text-danger-600' : 'text-neutral-500'}`}>
                      {formatarData(a.data_prevista)}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">Nenhuma atividade pendente.</p>
          )}
          <Link to="../atividades" className="mt-3 inline-block text-sm font-medium text-primary-700 hover:underline">
            Ver todas as atividades
          </Link>
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-medium text-neutral-900">
            <AlertTriangle size={18} className="text-warning-600" /> Próximas colheitas
          </h2>
          {resumoPlantacoes?.proximasColheitas.length ? (
            <ul className="flex flex-col gap-2">
              {resumoPlantacoes.proximasColheitas.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">{p.culturas?.nome}</span>
                  <span className="text-neutral-500">{formatarData(p.previsao_colheita!)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-400">Nenhuma colheita prevista nos próximos 30 dias.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-medium text-neutral-900">Receita x despesa (últimos meses)</h2>
          {serieFinanceira && serieFinanceira.length > 0 ? (
            <Bar
              data={{
                labels: serieFinanceira.map((s) => s.mes),
                datasets: [
                  { label: 'Receita', data: serieFinanceira.map((s) => s.receita), backgroundColor: coresGrafico.receita },
                  { label: 'Despesa', data: serieFinanceira.map((s) => s.despesa), backgroundColor: coresGrafico.despesa },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          ) : (
            <EmptyState titulo="Sem dados financeiros ainda" />
          )}
        </Card>

        <Card>
          <h2 className="mb-3 font-medium text-neutral-900">Produção por cultura</h2>
          {resumoPlantacoes?.producaoPorCultura.length ? (
            <Bar
              data={{
                labels: resumoPlantacoes.producaoPorCultura.map((p) => p.cultura),
                datasets: [
                  {
                    label: 'Quantidade colhida',
                    data: resumoPlantacoes.producaoPorCultura.map((p) => p.quantidade),
                    backgroundColor: '#3f8a37',
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          ) : (
            <EmptyState titulo="Nenhuma colheita registrada ainda" />
          )}
        </Card>
      </div>
    </div>
  )
}

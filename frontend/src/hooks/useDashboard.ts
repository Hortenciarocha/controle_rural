import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { primeiroDiaDoMes, ultimoDiaDoMes } from './useFinanceiro'

export function useResumoFinanceiroMes(propriedadeId: string) {
  const dataInicio = primeiroDiaDoMes()
  const dataFim = ultimoDiaDoMes()
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'dashboard', 'financeiro-mes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financeiro_lancamentos')
        .select('tipo, valor')
        .eq('propriedade_id', propriedadeId)
        .gte('data', dataInicio)
        .lte('data', dataFim)
      if (error) throw error
      const receita = data.filter((l) => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0)
      const despesa = data.filter((l) => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0)
      return { receita, despesa, lucro: receita - despesa }
    },
  })
}

export function useSerieFinanceiraMensal(propriedadeId: string, meses = 6) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'dashboard', 'financeiro-serie', meses],
    queryFn: async () => {
      const inicio = new Date()
      inicio.setDate(1)
      inicio.setMonth(inicio.getMonth() - (meses - 1))
      const dataInicio = inicio.toISOString().slice(0, 10)

      const { data, error } = await supabase
        .from('financeiro_lancamentos')
        .select('tipo, valor, data')
        .eq('propriedade_id', propriedadeId)
        .gte('data', dataInicio)
      if (error) throw error

      const grupos = new Map<string, { receita: number; despesa: number }>()
      for (let i = 0; i < meses; i++) {
        const d = new Date(inicio.getFullYear(), inicio.getMonth() + i, 1)
        grupos.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, { receita: 0, despesa: 0 })
      }
      for (const lancamento of data) {
        const chave = lancamento.data.slice(0, 7)
        const grupo = grupos.get(chave)
        if (!grupo) continue
        if (lancamento.tipo === 'receita') grupo.receita += lancamento.valor
        else grupo.despesa += lancamento.valor
      }
      return Array.from(grupos.entries()).map(([mes, valores]) => ({ mes, ...valores }))
    },
  })
}

export function useAlertasAbertos(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'alertas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alertas')
        .select('*')
        .eq('propriedade_id', propriedadeId)
        .eq('lido', false)
        .order('criado_em', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useResumoAnimais(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'dashboard', 'animais'],
    queryFn: async () => {
      const daqui7dias = new Date()
      daqui7dias.setDate(daqui7dias.getDate() + 7)

      const { count: totalAnimais, error: erroAnimais } = await supabase
        .from('animais')
        .select('id', { count: 'exact', head: true })
        .eq('propriedade_id', propriedadeId)
      if (erroAnimais) throw erroAnimais

      const { data: vacinasProximas, error: erroVacinas } = await supabase
        .from('eventos_sanitarios')
        .select('id, descricao, proxima_data, animais!inner(propriedade_id, identificacao, especie)')
        .eq('animais.propriedade_id', propriedadeId)
        .not('proxima_data', 'is', null)
        .lte('proxima_data', daqui7dias.toISOString().slice(0, 10))
        .order('proxima_data')
      if (erroVacinas) throw erroVacinas

      return { totalAnimais: totalAnimais ?? 0, vacinasProximas }
    },
  })
}

interface PlantioResumo {
  id: string
  area_plantada: number
  previsao_colheita: string | null
  data_colheita: string | null
  quantidade_colhida: number | null
  culturas: { nome: string; unidade_producao: string } | null
}

export function useResumoPlantacoes(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'dashboard', 'plantacoes'],
    queryFn: async () => {
      const daqui30dias = new Date()
      daqui30dias.setDate(daqui30dias.getDate() + 30)

      const { data: dadosBrutos, error } = await supabase
        .from('plantios')
        .select('id, area_plantada, previsao_colheita, data_colheita, quantidade_colhida, talhoes!inner(propriedade_id), culturas(nome, unidade_producao)')
        .eq('talhoes.propriedade_id', propriedadeId)
      if (error) throw error
      const data = dadosBrutos as unknown as PlantioResumo[]

      const emAndamento = data.filter((p) => !p.data_colheita)
      const areaEmAndamento = emAndamento.reduce((s, p) => s + p.area_plantada, 0)
      const proximasColheitas = emAndamento
        .filter((p) => p.previsao_colheita && p.previsao_colheita <= daqui30dias.toISOString().slice(0, 10))
        .sort((a, b) => (a.previsao_colheita! < b.previsao_colheita! ? -1 : 1))

      const producaoPorCultura = new Map<string, { quantidade: number; unidade: string }>()
      for (const p of data) {
        if (p.quantidade_colhida == null || !p.culturas) continue
        const atual = producaoPorCultura.get(p.culturas.nome) ?? { quantidade: 0, unidade: p.culturas.unidade_producao }
        atual.quantidade += p.quantidade_colhida
        producaoPorCultura.set(p.culturas.nome, atual)
      }

      return {
        plantiosEmAndamento: emAndamento.length,
        areaEmAndamento,
        proximasColheitas,
        producaoPorCultura: Array.from(producaoPorCultura.entries()).map(([cultura, v]) => ({ cultura, ...v })),
      }
    },
  })
}

export function useAtividadesPendentesDashboard(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'dashboard', 'atividades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('atividades')
        .select('*')
        .eq('propriedade_id', propriedadeId)
        .neq('status', 'concluida')
        .order('data_prevista')
        .limit(6)
      if (error) throw error
      const hoje = new Date().toISOString().slice(0, 10)
      const atrasadas = data.filter((a) => a.data_prevista < hoje).length
      return { atividades: data, atrasadas }
    },
  })
}

export function useAlertasEstoqueBaixo(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'dashboard', 'estoque-baixo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('estoque_itens')
        .select('*')
        .eq('propriedade_id', propriedadeId)
      if (error) throw error
      return data.filter((item) => item.quantidade_atual <= item.estoque_minimo)
    },
  })
}

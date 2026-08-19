import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useLancamentos(propriedadeId: string, dataInicio: string, dataFim: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'financeiro', dataInicio, dataFim],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financeiro_lancamentos')
        .select('*')
        .eq('propriedade_id', propriedadeId)
        .gte('data', dataInicio)
        .lte('data', dataFim)
        .order('data', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function primeiroDiaDoMes() {
  const hoje = new Date()
  return new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().slice(0, 10)
}

export function ultimoDiaDoMes() {
  const hoje = new Date()
  return new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().slice(0, 10)
}

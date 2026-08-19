import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export interface PlantioComRelacoes {
  id: string
  talhao_id: string
  cultura_id: string
  data_plantio: string
  area_plantada: number
  previsao_colheita: string | null
  data_colheita: string | null
  quantidade_colhida: number | null
  observacoes: string | null
  talhoes: { id: string; nome: string; propriedade_id: string }
  culturas: { nome: string; unidade_producao: string } | null
}

export function usePlantios(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'plantios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plantios')
        .select('*, talhoes!inner(id, nome, propriedade_id), culturas(nome, unidade_producao)')
        .eq('talhoes.propriedade_id', propriedadeId)
        .order('data_plantio', { ascending: false })
      if (error) throw error
      return data as unknown as PlantioComRelacoes[]
    },
  })
}

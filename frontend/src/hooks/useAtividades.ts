import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useAtividades(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'atividades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('atividades')
        .select('*')
        .eq('propriedade_id', propriedadeId)
        .order('data_prevista')
      if (error) throw error
      return data
    },
  })
}

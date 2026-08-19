import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useTalhoes(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'talhoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talhoes')
        .select('*')
        .eq('propriedade_id', propriedadeId)
        .order('nome')
      if (error) throw error
      return data
    },
  })
}

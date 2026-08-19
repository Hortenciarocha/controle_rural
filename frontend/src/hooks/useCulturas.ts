import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useCulturas(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'culturas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('culturas')
        .select('*')
        .or(`propriedade_id.is.null,propriedade_id.eq.${propriedadeId}`)
        .order('nome')
      if (error) throw error
      return data
    },
  })
}

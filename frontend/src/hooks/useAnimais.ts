import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useAnimais(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'animais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('animais')
        .select('*')
        .eq('propriedade_id', propriedadeId)
        .order('criado_em', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useAnimal(animalId: string) {
  return useQuery({
    queryKey: ['animais', animalId],
    queryFn: async () => {
      const { data, error } = await supabase.from('animais').select('*').eq('id', animalId).single()
      if (error) throw error
      return data
    },
  })
}

export function useEventosSanitarios(animalId: string) {
  return useQuery({
    queryKey: ['animais', animalId, 'eventos-sanitarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eventos_sanitarios')
        .select('*')
        .eq('animal_id', animalId)
        .order('data', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

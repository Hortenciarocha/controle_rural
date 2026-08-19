import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

export function useEstoqueItens(propriedadeId: string) {
  return useQuery({
    queryKey: ['propriedades', propriedadeId, 'estoque-itens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('estoque_itens')
        .select('*')
        .eq('propriedade_id', propriedadeId)
        .order('nome')
      if (error) throw error
      return data
    },
  })
}

export function useMovimentacoesEstoque(itemId: string) {
  return useQuery({
    queryKey: ['estoque-itens', itemId, 'movimentacoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movimentacoes_estoque')
        .select('*')
        .eq('item_id', itemId)
        .order('data', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

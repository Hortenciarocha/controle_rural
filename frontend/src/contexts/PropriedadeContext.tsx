import { createContext, useContext, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/database.types'

type Propriedade = Database['public']['Tables']['propriedades']['Row']

interface PropriedadeContextValue {
  propriedadeId: string
  propriedade: Propriedade | undefined
  carregando: boolean
}

const PropriedadeContext = createContext<PropriedadeContextValue | undefined>(undefined)

export function usePropriedadesDoUsuario() {
  return useQuery({
    queryKey: ['propriedades'],
    queryFn: async () => {
      const { data, error } = await supabase.from('propriedades').select('*').order('nome')
      if (error) throw error
      return data
    },
  })
}

export function PropriedadeProvider({ children }: { children: ReactNode }) {
  const { propriedadeId } = useParams<{ propriedadeId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['propriedades', propriedadeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('propriedades')
        .select('*')
        .eq('id', propriedadeId!)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!propriedadeId,
  })

  if (!propriedadeId) throw new Error('PropriedadeProvider usado fora de uma rota /p/:propriedadeId')

  return (
    <PropriedadeContext.Provider value={{ propriedadeId, propriedade: data, carregando: isLoading }}>
      {children}
    </PropriedadeContext.Provider>
  )
}

export function usePropriedadeAtiva() {
  const context = useContext(PropriedadeContext)
  if (!context) throw new Error('usePropriedadeAtiva precisa estar dentro de um PropriedadeProvider')
  return context
}

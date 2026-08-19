import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Modal } from '@/components/ui/Modal'
import { FormField, inputClassName } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

const esquema = z.object({
  nome: z.string().min(2, 'Informe o nome da propriedade.'),
  localizacao: z.string().min(2, 'Informe a localização.'),
  area_total: z.coerce.number({ message: 'Informe a área total.' }).positive('A área deve ser maior que zero.'),
})

type FormValues = z.infer<typeof esquema>

interface NovaPropriedadeModalProps {
  aberto: boolean
  aoFechar: () => void
  aoCriar: (propriedadeId: string) => void
}

export function NovaPropriedadeModal({ aberto, aoFechar, aoCriar }: NovaPropriedadeModalProps) {
  const queryClient = useQueryClient()
  const [erro, setErro] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof esquema>, any, FormValues>({ resolver: zodResolver(esquema) })

  const criarPropriedade = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { data, error } = await supabase.rpc('criar_propriedade', {
        p_nome: valores.nome,
        p_localizacao: valores.localizacao,
        p_area_total: valores.area_total,
      })
      if (error) throw error
      return data
    },
    onSuccess: (propriedade) => {
      queryClient.invalidateQueries({ queryKey: ['propriedades'] })
      reset()
      aoFechar()
      aoCriar(propriedade.id)
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Nova propriedade" aberto={aberto} aoFechar={aoFechar}>
      <form onSubmit={handleSubmit((valores) => criarPropriedade.mutate(valores))} noValidate>
        {erro && (
          <div className="mb-4">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <FormField label="Nome da propriedade" erro={errors.nome?.message}>
          <input className={inputClassName} placeholder="Ex.: Sítio Boa Vista" {...register('nome')} />
        </FormField>
        <FormField label="Localização" erro={errors.localizacao?.message}>
          <input className={inputClassName} placeholder="Cidade / Estado" {...register('localizacao')} />
        </FormField>
        <FormField label="Área total (hectares)" erro={errors.area_total?.message}>
          <input type="number" step="0.01" className={inputClassName} placeholder="0,00" {...register('area_total')} />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Salvar propriedade
        </Button>
      </form>
    </Modal>
  )
}

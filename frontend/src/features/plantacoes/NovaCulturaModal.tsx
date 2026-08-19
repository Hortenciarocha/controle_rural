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
  nome: z.string().min(1, 'Informe o nome da cultura.'),
  ciclo_medio_dias: z.coerce.number({ message: 'Informe o ciclo médio.' }).int().positive('Deve ser maior que zero.'),
  unidade_producao: z.string().min(1, 'Informe a unidade de produção.'),
})
type FormValues = z.infer<typeof esquema>

export function NovaCulturaModal({
  propriedadeId,
  aberto,
  aoFechar,
}: {
  propriedadeId: string
  aberto: boolean
  aoFechar: () => void
}) {
  const queryClient = useQueryClient()
  const [erro, setErro] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof esquema>, any, FormValues>({ resolver: zodResolver(esquema) })

  const criarCultura = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('culturas').insert({ ...valores, propriedade_id: propriedadeId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'culturas'] })
      reset()
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Nova cultura" aberto={aberto} aoFechar={aoFechar}>
      <form onSubmit={handleSubmit((valores) => criarCultura.mutate(valores))} noValidate>
        {erro && (
          <div className="mb-4">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <FormField label="Nome da cultura" erro={errors.nome?.message}>
          <input className={inputClassName} placeholder="Ex.: Abacaxi" {...register('nome')} />
        </FormField>
        <FormField label="Ciclo médio (dias)" erro={errors.ciclo_medio_dias?.message}>
          <input type="number" className={inputClassName} placeholder="Ex.: 150" {...register('ciclo_medio_dias')} />
        </FormField>
        <FormField label="Unidade de produção" erro={errors.unidade_producao?.message}>
          <input className={inputClassName} placeholder="Ex.: sacas, kg, toneladas" {...register('unidade_producao')} />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Salvar cultura
        </Button>
      </form>
    </Modal>
  )
}

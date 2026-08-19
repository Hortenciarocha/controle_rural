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

const hoje = () => new Date().toISOString().slice(0, 10)

const esquema = z.object({
  tipo: z.enum(['vacina', 'tratamento', 'outro']),
  descricao: z.string().min(1, 'Descreva o evento (ex.: nome da vacina/medicamento).'),
  data: z.string().min(1, 'Informe a data.'),
  proxima_data: z.string().optional(),
  responsavel: z.string().optional(),
})
type FormValues = z.infer<typeof esquema>

export function NovoEventoSanitarioModal({
  animalId,
  aberto,
  aoFechar,
}: {
  animalId: string
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
  } = useForm<FormValues>({ resolver: zodResolver(esquema), defaultValues: { tipo: 'vacina', data: hoje() } })

  const criarEvento = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('eventos_sanitarios').insert({
        ...valores,
        proxima_data: valores.proxima_data || null,
        responsavel: valores.responsavel || null,
        animal_id: animalId,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animais', animalId, 'eventos-sanitarios'] })
      reset({ tipo: 'vacina', data: hoje() })
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Novo evento sanitário" aberto={aberto} aoFechar={aoFechar}>
      <form onSubmit={handleSubmit((valores) => criarEvento.mutate(valores))} noValidate>
        {erro && (
          <div className="mb-4">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <FormField label="Tipo" erro={errors.tipo?.message}>
          <select className={inputClassName} {...register('tipo')}>
            <option value="vacina">Vacina</option>
            <option value="tratamento">Tratamento</option>
            <option value="outro">Outro</option>
          </select>
        </FormField>
        <FormField label="Descrição" erro={errors.descricao?.message}>
          <input className={inputClassName} placeholder="Ex.: Febre aftosa" {...register('descricao')} />
        </FormField>
        <FormField label="Data" erro={errors.data?.message}>
          <input type="date" className={inputClassName} {...register('data')} />
        </FormField>
        <FormField label="Próxima dose/retorno" opcional erro={errors.proxima_data?.message}>
          <input type="date" className={inputClassName} {...register('proxima_data')} />
        </FormField>
        <FormField label="Responsável" opcional erro={errors.responsavel?.message}>
          <input className={inputClassName} {...register('responsavel')} />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Salvar evento
        </Button>
      </form>
    </Modal>
  )
}

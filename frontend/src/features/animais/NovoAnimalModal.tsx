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
  especie: z.string().min(1, 'Informe a espécie.'),
  raca: z.string().optional(),
  sexo: z.enum(['macho', 'femea']).optional(),
  data_nascimento: z.string().optional(),
  peso: z.coerce.number().positive().optional().or(z.literal('').transform(() => undefined)),
  identificacao: z.string().optional(),
})
type FormValues = z.infer<typeof esquema>

export function NovoAnimalModal({
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

  const criarAnimal = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('animais').insert({
        ...valores,
        raca: valores.raca || null,
        data_nascimento: valores.data_nascimento || null,
        identificacao: valores.identificacao || null,
        propriedade_id: propriedadeId,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'animais'] })
      reset()
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Novo animal" aberto={aberto} aoFechar={aoFechar}>
      <form onSubmit={handleSubmit((valores) => criarAnimal.mutate(valores))} noValidate>
        {erro && (
          <div className="mb-4">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <FormField label="Espécie" erro={errors.especie?.message}>
          <input className={inputClassName} placeholder="Ex.: Bovino, Galinha" {...register('especie')} />
        </FormField>
        <FormField label="Raça" opcional erro={errors.raca?.message}>
          <input className={inputClassName} {...register('raca')} />
        </FormField>
        <FormField label="Sexo" opcional erro={errors.sexo?.message}>
          <select className={inputClassName} {...register('sexo')}>
            <option value="">Não informado</option>
            <option value="macho">Macho</option>
            <option value="femea">Fêmea</option>
          </select>
        </FormField>
        <FormField label="Data de nascimento" opcional erro={errors.data_nascimento?.message}>
          <input type="date" className={inputClassName} {...register('data_nascimento')} />
        </FormField>
        <FormField label="Peso (kg)" opcional erro={errors.peso?.message}>
          <input type="number" step="0.01" className={inputClassName} {...register('peso')} />
        </FormField>
        <FormField label="Identificação (brinco/nome/código)" opcional erro={errors.identificacao?.message}>
          <input className={inputClassName} {...register('identificacao')} />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Salvar animal
        </Button>
      </form>
    </Modal>
  )
}

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
import type { PlantioComRelacoes } from '@/hooks/usePlantios'

const hoje = () => new Date().toISOString().slice(0, 10)

const esquema = z.object({
  data_colheita: z.string().min(1, 'Informe a data da colheita.'),
  quantidade_colhida: z.coerce.number({ message: 'Informe a quantidade colhida.' }).nonnegative('Não pode ser negativa.'),
})
type FormValues = z.infer<typeof esquema>

export function RegistrarColheitaModal({
  propriedadeId,
  plantio,
  aoFechar,
}: {
  propriedadeId: string
  plantio: PlantioComRelacoes | null
  aoFechar: () => void
}) {
  const queryClient = useQueryClient()
  const [erro, setErro] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof esquema>, any, FormValues>({
    resolver: zodResolver(esquema),
    defaultValues: { data_colheita: hoje() },
  })

  const registrarColheita = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('plantios').update(valores).eq('id', plantio!.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'plantios'] })
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Registrar colheita" aberto={!!plantio} aoFechar={aoFechar}>
      {plantio && (
        <>
          <p className="mb-4 text-sm text-neutral-600">
            {plantio.culturas?.nome} — {plantio.talhoes.nome} ({plantio.area_plantada} ha)
          </p>
          <form onSubmit={handleSubmit((valores) => registrarColheita.mutate(valores))} noValidate>
            {erro && (
              <div className="mb-4">
                <Alert tipo="erro">{erro}</Alert>
              </div>
            )}
            <FormField label="Data da colheita" erro={errors.data_colheita?.message}>
              <input type="date" className={inputClassName} {...register('data_colheita')} />
            </FormField>
            <FormField
              label={`Quantidade colhida (${plantio.culturas?.unidade_producao ?? 'unidade'})`}
              erro={errors.quantidade_colhida?.message}
            >
              <input type="number" step="0.001" className={inputClassName} {...register('quantidade_colhida')} />
            </FormField>
            <Button type="submit" carregando={isSubmitting} className="w-full">
              Salvar colheita
            </Button>
          </form>
        </>
      )}
    </Modal>
  )
}

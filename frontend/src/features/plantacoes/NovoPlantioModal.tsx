import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useTalhoes } from '@/hooks/useTalhoes'
import { useCulturas } from '@/hooks/useCulturas'
import { Modal } from '@/components/ui/Modal'
import { FormField, inputClassName } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

const hoje = () => new Date().toISOString().slice(0, 10)

const esquema = z.object({
  talhao_id: z.string().min(1, 'Selecione o talhão.'),
  cultura_id: z.string().min(1, 'Selecione a cultura.'),
  data_plantio: z.string().min(1, 'Informe a data do plantio.'),
  area_plantada: z.coerce.number({ message: 'Informe a área plantada.' }).positive('Deve ser maior que zero.'),
})
type FormValues = z.infer<typeof esquema>

export function NovoPlantioModal({
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
  const { data: talhoes } = useTalhoes(propriedadeId)
  const { data: culturas } = useCulturas(propriedadeId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof esquema>, any, FormValues>({
    resolver: zodResolver(esquema),
    defaultValues: { data_plantio: hoje() },
  })

  const criarPlantio = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('plantios').insert(valores)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'plantios'] })
      reset({ data_plantio: hoje() })
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  const semTalhoes = !talhoes || talhoes.length === 0

  return (
    <Modal titulo="Novo plantio" aberto={aberto} aoFechar={aoFechar}>
      {semTalhoes ? (
        <Alert tipo="atencao">Cadastre um talhão em "Propriedade" antes de registrar um plantio.</Alert>
      ) : (
        <form onSubmit={handleSubmit((valores) => criarPlantio.mutate(valores))} noValidate>
          {erro && (
            <div className="mb-4">
              <Alert tipo="erro">{erro}</Alert>
            </div>
          )}
          <FormField label="Talhão" erro={errors.talhao_id?.message}>
            <select className={inputClassName} {...register('talhao_id')}>
              <option value="">Selecione...</option>
              {talhoes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Cultura" erro={errors.cultura_id?.message}>
            <select className={inputClassName} {...register('cultura_id')}>
              <option value="">Selecione...</option>
              {culturas?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Data do plantio" erro={errors.data_plantio?.message}>
            <input type="date" className={inputClassName} {...register('data_plantio')} />
          </FormField>
          <FormField label="Área plantada (hectares)" erro={errors.area_plantada?.message}>
            <input type="number" step="0.01" className={inputClassName} {...register('area_plantada')} />
          </FormField>
          <p className="mb-4 text-xs text-neutral-500">
            A previsão de colheita é calculada automaticamente a partir do ciclo médio da cultura.
          </p>
          <Button type="submit" carregando={isSubmitting} className="w-full">
            Salvar plantio
          </Button>
        </form>
      )}
    </Modal>
  )
}

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

const categorias = [
  { valor: 'insumo', rotulo: 'Insumo' },
  { valor: 'racao', rotulo: 'Ração' },
  { valor: 'fertilizante', rotulo: 'Fertilizante' },
  { valor: 'medicamento', rotulo: 'Medicamento' },
  { valor: 'ferramenta', rotulo: 'Ferramenta' },
  { valor: 'equipamento', rotulo: 'Equipamento' },
  { valor: 'outro', rotulo: 'Outro' },
] as const

const esquema = z.object({
  nome: z.string().min(1, 'Informe o nome do item.'),
  categoria: z.enum(['insumo', 'racao', 'fertilizante', 'medicamento', 'ferramenta', 'equipamento', 'outro']),
  unidade: z.string().min(1, 'Informe a unidade (ex.: kg, litros, un).'),
  estoque_minimo: z.coerce.number({ message: 'Informe o estoque mínimo.' }).nonnegative('Não pode ser negativo.'),
})
type FormValues = z.infer<typeof esquema>

export function NovoItemEstoqueModal({
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
  } = useForm<z.input<typeof esquema>, any, FormValues>({
    resolver: zodResolver(esquema),
    defaultValues: { categoria: 'insumo', estoque_minimo: 0 },
  })

  const criarItem = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('estoque_itens').insert({ ...valores, propriedade_id: propriedadeId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'estoque-itens'] })
      reset({ categoria: 'insumo', estoque_minimo: 0 })
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Novo item de estoque" aberto={aberto} aoFechar={aoFechar}>
      <form onSubmit={handleSubmit((valores) => criarItem.mutate(valores))} noValidate>
        {erro && (
          <div className="mb-4">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <FormField label="Nome" erro={errors.nome?.message}>
          <input className={inputClassName} placeholder="Ex.: Ração para gado" {...register('nome')} />
        </FormField>
        <FormField label="Categoria" erro={errors.categoria?.message}>
          <select className={inputClassName} {...register('categoria')}>
            {categorias.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Unidade" erro={errors.unidade?.message}>
          <input className={inputClassName} placeholder="Ex.: kg, litros, un" {...register('unidade')} />
        </FormField>
        <FormField label="Estoque mínimo" erro={errors.estoque_minimo?.message}>
          <input type="number" step="0.001" className={inputClassName} {...register('estoque_minimo')} />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Salvar item
        </Button>
      </form>
    </Modal>
  )
}

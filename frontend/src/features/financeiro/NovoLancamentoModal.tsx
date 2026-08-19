import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Modal } from '@/components/ui/Modal'
import { FormField, inputClassName } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

const categoriasReceita = ['Venda de animais', 'Venda de produtos agrícolas', 'Venda de leite', 'Venda de ovos', 'Outras receitas']
const categoriasDespesa = [
  'Ração',
  'Sementes',
  'Fertilizantes',
  'Medicamentos',
  'Combustível',
  'Manutenção',
  'Mão de obra',
  'Energia',
  'Outras despesas',
]

const hoje = () => new Date().toISOString().slice(0, 10)

const esquema = z.object({
  tipo: z.enum(['receita', 'despesa']),
  categoria: z.string().min(1, 'Selecione a categoria.'),
  valor: z.coerce.number({ message: 'Informe o valor.' }).positive('Deve ser maior que zero.'),
  data: z.string().min(1, 'Informe a data.'),
  descricao: z.string().optional(),
})
type FormValues = z.infer<typeof esquema>

export function NovoLancamentoModal({
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
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof esquema>, any, FormValues>({
    resolver: zodResolver(esquema),
    defaultValues: { tipo: 'despesa', data: hoje() },
  })

  const tipo = useWatch({ control, name: 'tipo' })
  const categorias = tipo === 'receita' ? categoriasReceita : categoriasDespesa

  const criarLancamento = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('financeiro_lancamentos').insert({ ...valores, propriedade_id: propriedadeId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'financeiro'] })
      reset({ tipo: 'despesa', data: hoje() })
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Novo lançamento" aberto={aberto} aoFechar={aoFechar}>
      <form onSubmit={handleSubmit((valores) => criarLancamento.mutate(valores))} noValidate>
        {erro && (
          <div className="mb-4">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <FormField label="Tipo" erro={errors.tipo?.message}>
          <select className={inputClassName} {...register('tipo')}>
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
        </FormField>
        <FormField label="Categoria" erro={errors.categoria?.message}>
          <select className={inputClassName} {...register('categoria')}>
            <option value="">Selecione...</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Valor (R$)" erro={errors.valor?.message}>
          <input type="number" step="0.01" className={inputClassName} {...register('valor')} />
        </FormField>
        <FormField label="Data" erro={errors.data?.message}>
          <input type="date" className={inputClassName} {...register('data')} />
        </FormField>
        <FormField label="Descrição" opcional erro={errors.descricao?.message}>
          <input className={inputClassName} {...register('descricao')} />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Salvar lançamento
        </Button>
      </form>
    </Modal>
  )
}

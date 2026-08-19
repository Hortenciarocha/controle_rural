import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useMovimentacoesEstoque } from '@/hooks/useEstoque'
import { Modal } from '@/components/ui/Modal'
import { FormField, inputClassName } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { PageLoader } from '@/components/ui/PageLoader'
import { formatarData } from '@/lib/format'
import type { Database } from '@/types/database.types'

type EstoqueItem = Database['public']['Tables']['estoque_itens']['Row']

const hoje = () => new Date().toISOString().slice(0, 10)

const esquema = z.object({
  tipo: z.enum(['entrada', 'saida']),
  quantidade: z.coerce.number({ message: 'Informe a quantidade.' }).positive('Deve ser maior que zero.'),
  data: z.string().min(1, 'Informe a data.'),
  custo: z.coerce.number().nonnegative().optional().or(z.literal('').transform(() => undefined)),
  motivo: z.string().optional(),
})
type FormValues = z.infer<typeof esquema>

export function ItemEstoqueDetalheModal({
  propriedadeId,
  item,
  aoFechar,
}: {
  propriedadeId: string
  item: EstoqueItem | null
  aoFechar: () => void
}) {
  const queryClient = useQueryClient()
  const [erro, setErro] = useState<string | null>(null)
  const { data: movimentacoes, isLoading } = useMovimentacoesEstoque(item?.id ?? '')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof esquema>, any, FormValues>({
    resolver: zodResolver(esquema),
    defaultValues: { tipo: 'entrada', data: hoje() },
  })

  const registrarMovimentacao = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('movimentacoes_estoque').insert({ ...valores, item_id: item!.id })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoque-itens', item!.id, 'movimentacoes'] })
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'estoque-itens'] })
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'alertas'] })
      reset({ tipo: 'entrada', data: hoje() })
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo={item?.nome ?? ''} aberto={!!item} aoFechar={aoFechar}>
      {item && (
        <>
          <p className="mb-4 text-sm text-neutral-600">
            Disponível: <span className="font-semibold text-neutral-900">{item.quantidade_atual} {item.unidade}</span>
            {' · '}mínimo {item.estoque_minimo} {item.unidade}
          </p>

          <form onSubmit={handleSubmit((valores) => registrarMovimentacao.mutate(valores))} noValidate className="mb-5 rounded-lg border border-neutral-200 p-3">
            {erro && (
              <div className="mb-3">
                <Alert tipo="erro">{erro}</Alert>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tipo" erro={errors.tipo?.message}>
                <select className={inputClassName} {...register('tipo')}>
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>
              </FormField>
              <FormField label="Quantidade" erro={errors.quantidade?.message}>
                <input type="number" step="0.001" className={inputClassName} {...register('quantidade')} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Data" erro={errors.data?.message}>
                <input type="date" className={inputClassName} {...register('data')} />
              </FormField>
              <FormField label="Custo (R$)" opcional erro={errors.custo?.message}>
                <input type="number" step="0.01" className={inputClassName} {...register('custo')} />
              </FormField>
            </div>
            <FormField label="Motivo/uso" opcional erro={errors.motivo?.message}>
              <input className={inputClassName} placeholder="Ex.: Compra mensal, uso no pasto" {...register('motivo')} />
            </FormField>
            <Button type="submit" carregando={isSubmitting} className="w-full">
              Registrar movimentação
            </Button>
          </form>

          <h3 className="mb-2 text-sm font-medium text-neutral-700">Últimas movimentações</h3>
          {isLoading ? (
            <PageLoader />
          ) : (
            <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {movimentacoes?.map((mov) => (
                <li key={mov.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-neutral-700">
                    {mov.tipo === 'entrada' ? (
                      <ArrowDownCircle size={16} className="text-primary-600" />
                    ) : (
                      <ArrowUpCircle size={16} className="text-danger-600" />
                    )}
                    {mov.motivo || (mov.tipo === 'entrada' ? 'Entrada' : 'Saída')}
                  </span>
                  <span className="text-neutral-500">
                    {mov.quantidade} {item.unidade} · {formatarData(mov.data)}
                  </span>
                </li>
              ))}
              {movimentacoes?.length === 0 && <p className="text-sm text-neutral-400">Nenhuma movimentação ainda.</p>}
            </ul>
          )}
        </>
      )}
    </Modal>
  )
}

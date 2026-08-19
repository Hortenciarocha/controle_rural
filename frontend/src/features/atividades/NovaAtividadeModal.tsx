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

const tipos = [
  { valor: 'plantio', rotulo: 'Plantio' },
  { valor: 'irrigacao', rotulo: 'Irrigação' },
  { valor: 'adubacao', rotulo: 'Adubação' },
  { valor: 'aplicacao_produtos', rotulo: 'Aplicação de produtos' },
  { valor: 'vacinacao', rotulo: 'Vacinação' },
  { valor: 'alimentacao', rotulo: 'Alimentação' },
  { valor: 'manutencao', rotulo: 'Manutenção' },
  { valor: 'colheita', rotulo: 'Colheita' },
  { valor: 'outras', rotulo: 'Outras' },
] as const

const hoje = () => new Date().toISOString().slice(0, 10)

const esquema = z.object({
  titulo: z.string().min(1, 'Informe o título da atividade.'),
  tipo: z.enum(['plantio', 'irrigacao', 'adubacao', 'aplicacao_produtos', 'vacinacao', 'alimentacao', 'manutencao', 'colheita', 'outras']),
  data_prevista: z.string().min(1, 'Informe a data prevista.'),
  descricao: z.string().optional(),
})
type FormValues = z.infer<typeof esquema>

export function NovaAtividadeModal({
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
  } = useForm<FormValues>({ resolver: zodResolver(esquema), defaultValues: { tipo: 'outras', data_prevista: hoje() } })

  const criarAtividade = useMutation({
    mutationFn: async (valores: FormValues) => {
      const { error } = await supabase.from('atividades').insert({ ...valores, propriedade_id: propriedadeId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'atividades'] })
      reset({ tipo: 'outras', data_prevista: hoje() })
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Nova atividade" aberto={aberto} aoFechar={aoFechar}>
      <form onSubmit={handleSubmit((valores) => criarAtividade.mutate(valores))} noValidate>
        {erro && (
          <div className="mb-4">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <FormField label="Título" erro={errors.titulo?.message}>
          <input className={inputClassName} placeholder="Ex.: Vacinar bezerros" {...register('titulo')} />
        </FormField>
        <FormField label="Tipo" erro={errors.tipo?.message}>
          <select className={inputClassName} {...register('tipo')}>
            {tipos.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.rotulo}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Data prevista" erro={errors.data_prevista?.message}>
          <input type="date" className={inputClassName} {...register('data_prevista')} />
        </FormField>
        <FormField label="Descrição" opcional erro={errors.descricao?.message}>
          <input className={inputClassName} {...register('descricao')} />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Salvar atividade
        </Button>
      </form>
    </Modal>
  )
}

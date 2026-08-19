import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { usePropriedadeAtiva } from '@/contexts/PropriedadeContext'
import { useTalhoes } from '@/hooks/useTalhoes'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FormField, inputClassName } from '@/components/forms/FormField'
import { Alert } from '@/components/ui/Alert'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'

const esquemaPropriedade = z.object({
  nome: z.string().min(2, 'Informe o nome.'),
  localizacao: z.string().min(2, 'Informe a localização.'),
  area_total: z.coerce.number({ message: 'Informe a área total.' }).positive('Deve ser maior que zero.'),
})
type FormPropriedade = z.infer<typeof esquemaPropriedade>

const esquemaTalhao = z.object({
  nome: z.string().min(1, 'Informe o nome do talhão.'),
  area: z.coerce.number({ message: 'Informe a área.' }).positive('Deve ser maior que zero.'),
})
type FormTalhao = z.infer<typeof esquemaTalhao>

export function Propriedade() {
  const { propriedade, propriedadeId, carregando } = usePropriedadeAtiva()
  const queryClient = useQueryClient()
  const [erro, setErro] = useState<string | null>(null)
  const [modalTalhaoAberto, setModalTalhaoAberto] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<z.input<typeof esquemaPropriedade>, any, FormPropriedade>({
    resolver: zodResolver(esquemaPropriedade),
    values: propriedade
      ? { nome: propriedade.nome, localizacao: propriedade.localizacao, area_total: propriedade.area_total }
      : undefined,
  })

  const salvarPropriedade = useMutation({
    mutationFn: async (valores: FormPropriedade) => {
      const { error } = await supabase.from('propriedades').update(valores).eq('id', propriedadeId)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['propriedades'] }),
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  const { data: talhoes, isLoading: carregandoTalhoes } = useTalhoes(propriedadeId)

  if (carregando) return <PageLoader />

  return (
    <div>
      <PageHeader titulo="Propriedade" />

      <Card className="mb-6">
        <h2 className="mb-3 font-medium text-neutral-900">Dados gerais</h2>
        {erro && (
          <div className="mb-3">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <form
          onSubmit={handleSubmit((valores) => {
            setErro(null)
            salvarPropriedade.mutate(valores)
          })}
          noValidate
        >
          <FormField label="Nome" erro={errors.nome?.message}>
            <input className={inputClassName} {...register('nome')} />
          </FormField>
          <FormField label="Localização" erro={errors.localizacao?.message}>
            <input className={inputClassName} {...register('localizacao')} />
          </FormField>
          <FormField label="Área total (hectares)" erro={errors.area_total?.message}>
            <input type="number" step="0.01" className={inputClassName} {...register('area_total')} />
          </FormField>
          <Button type="submit" carregando={isSubmitting} disabled={!isDirty}>
            Salvar alterações
          </Button>
        </form>
      </Card>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium text-neutral-900">Talhões</h2>
        <Button variante="secundaria" onClick={() => setModalTalhaoAberto(true)}>
          <Plus size={16} /> Novo talhão
        </Button>
      </div>

      {carregandoTalhoes ? (
        <PageLoader />
      ) : talhoes && talhoes.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {talhoes.map((t) => (
            <Card key={t.id}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="font-medium text-neutral-900">{t.nome}</p>
                  <p className="text-sm text-neutral-500">{t.area} ha</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState titulo="Nenhum talhão cadastrado" descricao="Cadastre suas áreas de plantio." />
      )}

      <NovoTalhaoModal
        propriedadeId={propriedadeId}
        aberto={modalTalhaoAberto}
        aoFechar={() => setModalTalhaoAberto(false)}
      />
    </div>
  )
}

function NovoTalhaoModal({
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
  } = useForm<z.input<typeof esquemaTalhao>, any, FormTalhao>({ resolver: zodResolver(esquemaTalhao) })

  const criarTalhao = useMutation({
    mutationFn: async (valores: FormTalhao) => {
      const { error } = await supabase.from('talhoes').insert({ ...valores, propriedade_id: propriedadeId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propriedades', propriedadeId, 'talhoes'] })
      reset()
      aoFechar()
    },
    onError: () => setErro('Não foi possível salvar. Verifique sua conexão e tente novamente.'),
  })

  return (
    <Modal titulo="Novo talhão" aberto={aberto} aoFechar={aoFechar}>
      <form onSubmit={handleSubmit((valores) => criarTalhao.mutate(valores))} noValidate>
        {erro && (
          <div className="mb-4">
            <Alert tipo="erro">{erro}</Alert>
          </div>
        )}
        <FormField label="Nome do talhão" erro={errors.nome?.message}>
          <input className={inputClassName} placeholder="Ex.: Talhão 1" {...register('nome')} />
        </FormField>
        <FormField label="Área (hectares)" erro={errors.area?.message}>
          <input type="number" step="0.01" className={inputClassName} {...register('area')} />
        </FormField>
        <Button type="submit" carregando={isSubmitting} className="w-full">
          Salvar talhão
        </Button>
      </form>
    </Modal>
  )
}

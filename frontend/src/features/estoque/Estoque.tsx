import { useState } from 'react'
import { Plus, Package, AlertTriangle } from 'lucide-react'
import { usePropriedadeAtiva } from '@/contexts/PropriedadeContext'
import { useEstoqueItens } from '@/hooks/useEstoque'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/PageLoader'
import { NovoItemEstoqueModal } from './NovoItemEstoqueModal'
import { ItemEstoqueDetalheModal } from './ItemEstoqueDetalheModal'
import type { Database } from '@/types/database.types'

type EstoqueItem = Database['public']['Tables']['estoque_itens']['Row']

export function Estoque() {
  const { propriedadeId } = usePropriedadeAtiva()
  const { data: itens, isLoading } = useEstoqueItens(propriedadeId)
  const [modalNovoAberto, setModalNovoAberto] = useState(false)
  const [itemSelecionado, setItemSelecionado] = useState<EstoqueItem | null>(null)

  return (
    <div>
      <PageHeader
        titulo="Estoque"
        acao={
          <Button onClick={() => setModalNovoAberto(true)}>
            <Plus size={16} /> Novo item
          </Button>
        }
      />

      {isLoading ? (
        <PageLoader />
      ) : itens && itens.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((item) => {
            const baixo = item.quantidade_atual <= item.estoque_minimo
            return (
              <Card key={item.id} className="cursor-pointer hover:border-primary-300">
                <button className="w-full text-left" onClick={() => setItemSelecionado(item)}>
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                        <Package size={18} />
                      </span>
                      <p className="font-medium text-neutral-900">{item.nome}</p>
                    </div>
                    {baixo && (
                      <StatusBadge status="atencao">
                        <span className="flex items-center gap-1">
                          <AlertTriangle size={12} /> baixo
                        </span>
                      </StatusBadge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">
                    {item.quantidade_atual} {item.unidade} disponíveis
                  </p>
                  <p className="text-xs text-neutral-400">mínimo: {item.estoque_minimo} {item.unidade}</p>
                </button>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icone={<Package size={32} />}
          titulo="Nenhum item de estoque cadastrado"
          descricao="Cadastre insumos, ração, ferramentas e outros itens para controlar entradas e saídas."
        />
      )}

      <NovoItemEstoqueModal
        propriedadeId={propriedadeId}
        aberto={modalNovoAberto}
        aoFechar={() => setModalNovoAberto(false)}
      />
      <ItemEstoqueDetalheModal
        propriedadeId={propriedadeId}
        item={itemSelecionado}
        aoFechar={() => setItemSelecionado(null)}
      />
    </div>
  )
}

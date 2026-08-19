import type { ReactNode } from 'react'

export interface Coluna<T> {
  cabecalho: string
  render: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  itens: T[]
  colunas: Coluna<T>[]
  chave: (item: T) => string
  aoClicarLinha?: (item: T) => void
}

export function DataTable<T>({ itens, colunas, chave, aoClicarLinha }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full min-w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50">
          <tr>
            {colunas.map((coluna) => (
              <th key={coluna.cabecalho} className="px-4 py-3 font-medium text-neutral-600">
                {coluna.cabecalho}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {itens.map((item) => (
            <tr
              key={chave(item)}
              onClick={() => aoClicarLinha?.(item)}
              className={aoClicarLinha ? 'cursor-pointer hover:bg-neutral-50' : ''}
            >
              {colunas.map((coluna) => (
                <td key={coluna.cabecalho} className={`px-4 py-3 ${coluna.className ?? ''}`}>
                  {coluna.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

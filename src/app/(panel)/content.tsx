'use client'

import { columns } from './components/table/columns'
import { DataTable } from './components/table/data-table'
import { useGetItem } from './hooks/use-get-item'

export function Content() {
  const { data: itens } = useGetItem()

  return (
    <div className="container mx-auto py-10">
      {itens && <DataTable columns={columns} data={itens} />}
    </div>
  )
}

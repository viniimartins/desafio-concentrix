'use client'

import { Button } from '@/components/ui/button'

import { columns } from './components/table/columns'
import { DataTable } from './components/table/data-table'
import { useGetItem } from './hooks/use-get-item'

export function Content() {
  const { data: itens } = useGetItem()

  return (
    <>
      <div className="flex justify-end">
        <Button>Adicionar Item</Button>
      </div>

      {itens && <DataTable columns={columns} data={itens} />}
    </>
  )
}

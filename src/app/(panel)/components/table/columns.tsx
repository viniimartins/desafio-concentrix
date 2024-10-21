'use client'

import { ColumnDef } from '@tanstack/react-table'

import { IItem } from '../../types'

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const columns: ColumnDef<IItem>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
  },
  {
    accessorKey: 'priority',
    header: 'Prioridade',
  },
]

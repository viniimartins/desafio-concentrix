'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { priorityValue } from '@/utils/priority'

import { IItem, Priority } from '../../types'

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
    cell: ({ row }) => {
      const value: Priority = row.getValue('priority')

      const { variant, name } = priorityValue(value)

      return <Badge variant={variant}>{name}</Badge>
    },
  },
]

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { toast } from '@/hooks/use-toast'
import { QueryKeyProps } from '@/types/queryKeyProps'

import { Priority } from '../../types'

interface Item {
  id: string
  name: string
  description: string
  priority: Priority
}

export interface UpdateItem {
  item: Item
}

async function update({ item }: UpdateItem) {
  const { id, ...rawItem } = item

  const { data } = await axios.put(`/api/items/${id}`, {
    ...rawItem,
  })

  return data
}

export function useUpdateItem({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: update,
    mutationKey: ['update-item'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Opss, algo deu errado!',
        description: 'Erro ao editar o item.',
      })
    },
  })
}

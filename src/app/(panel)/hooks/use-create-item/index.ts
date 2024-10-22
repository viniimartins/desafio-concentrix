import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@/hooks/use-toast'
import { QueryKeyProps } from '@/types/queryKeyProps'

import { Priority } from '../../types'
import { api } from '@/service/api'

interface Item {
  name: string
  description: string
  priority: Priority
}

export interface CreateItem {
  item: Item
}

async function create({ item }: CreateItem) {
  const { data } = await api.post('/items', {
    ...item,
  })

  return data
}

export function useCreateItem({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    mutationKey: ['create-item'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Opss, algo deu errado!',
        description: 'Erro ao criar o item.',
      })
    },
  })
}

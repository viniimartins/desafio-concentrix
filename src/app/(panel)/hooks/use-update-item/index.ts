import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { toast } from '@/hooks/use-toast'
import { QueryKeyProps } from '@/types/queryKeyProps'

import { IItem, Priority } from '../../types'

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
    onMutate: async ({ item: { description, name, id } }) => {
      await queryClient.cancelQueries({ queryKey })

      const previousItems = queryClient.getQueryData<IItem[]>(queryKey)

      queryClient.setQueryData(queryKey, (old?: Item[]) => {
        if (old) {
          return old.map((item) =>
            item.id === id ? { ...item, description, name } : item,
          )
        }
        return old
      })

      return { previousItems }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousItems)
      toast({
        variant: 'destructive',
        title: 'Opss, algo deu errado!',
        description: 'Erro ao editar o item.',
      })
    },
  })
}

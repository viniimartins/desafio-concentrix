import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { QueryKeyProps } from '@/types/queryKeyProps'
import { toast } from '@/hooks/use-toast'
import { IItem } from '../../types'

interface Item {
  itemId: string
}

async function deleteItem({ itemId }: Item) {
  const { data } = await axios.delete(`/api/items/${itemId}`)

  return data
}

export function useDeleteItem({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteItem,
    mutationKey: ['delete-item'],
    onMutate: async ({ itemId }) => {
      await queryClient.cancelQueries({ queryKey })

      const previousItems = queryClient.getQueryData<IItem[]>(queryKey)

      queryClient.setQueryData(queryKey, (old?: IItem[]) => {
        if (old) {
          return old.filter((item) => item.id !== itemId);
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
        description: 'Erro ao excluir o item.',
      })
    },
  })
}

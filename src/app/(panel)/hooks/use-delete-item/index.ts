import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { QueryKeyProps } from '@/types/queryKeyProps'
import { toast } from '@/hooks/use-toast'

interface Item {
  itemId: string
}

async function deleteRegion({ itemId }: Item) {
  const { data } = await axios.delete(`/api/items/${itemId}`)

  return data
}

export function useDeleteItem({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRegion,
    mutationKey: ['delete-item'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Opss, algo deu errado!',
        description: 'Erro ao excluir o item.',
      })
    },
  })
}

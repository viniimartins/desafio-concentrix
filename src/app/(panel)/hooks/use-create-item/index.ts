import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { QueryKeyProps } from '@/types/queryKeyProps'

import { Priority } from '../../types'

interface Item {
  name: string
  description: string
  priority: Priority
}

export interface CreateItem {
  item: Item
}

async function create({ item }: CreateItem) {
  const { data } = await axios.post('/api/items', {
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
      console.log('error')
    },
  })
}

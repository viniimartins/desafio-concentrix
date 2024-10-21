import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { IItem } from '@/app/(panel)/types'
import { ItemMock } from '@/shared/mock/itens'

async function get() {
  const { data } = await axios.get<IItem[]>('/api/items')

  return data
}

export function useGetItem() {
  const queryKey = ['get-items']

  const query = useQuery({
    queryKey,
    queryFn: get,
    placeholderData: ItemMock,
  })

  return { ...query, queryKey }
}

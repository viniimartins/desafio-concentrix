import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { IItem } from '@/app/(panel)/types'

async function get() {
  const { data } = await axios.get<IItem[]>('/api/items')

  return data
}

export function useGetItem() {
  const queryKey = ['get-itens']

  const query = useQuery({
    queryKey,
    queryFn: get,
    placeholderData: keepPreviousData,
  })

  return { ...query, queryKey }
}

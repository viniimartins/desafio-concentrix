import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { IItem } from '@/app/types'

async function get() {
  const { data } = await axios.get<IItem[]>('/item')

  return data
}

export function useGetItem() {
  const queryKey = ['get-itens']

  return useQuery({
    queryKey,
    queryFn: get,
    placeholderData: keepPreviousData,
  })
}

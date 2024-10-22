import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { IItem } from '@/app/(panel)/types'
import { ItemMock } from '@/shared/mock/itens'

interface Props {
  search: string
}

async function get(search: string) {
  const { data } = await axios.get<IItem[]>('/api/items',
    {
      params: { search },
    }
  )

  return data
}

export function useGetItem({ search }: Props) {
  const queryKey = ['get-items', search]

  const query = useQuery({
    queryKey,
    queryFn: () => get(search),
    placeholderData: ItemMock,
  })

  return { ...query, queryKey }
}

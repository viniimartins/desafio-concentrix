import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { IItem, Priority } from '@/app/(panel)/types'
import { ItemMock } from '@/shared/mock/itens'

interface Props {
  name: string
  priority: Priority
}

async function get(name: string, priority: Priority) {
  const { data } = await axios.get<IItem[]>('/api/items', {
    params: { name, priority },
  })

  return data
}

export function useGetItem({ name, priority }: Props) {
  const queryKey = ['get-items', name, priority]

  const query = useQuery({
    queryKey,
    queryFn: () => get(name, priority),
    placeholderData: ItemMock,
  })

  return { ...query, queryKey }
}

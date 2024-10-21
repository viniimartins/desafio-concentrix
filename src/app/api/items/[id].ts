import { NextApiRequest, NextApiResponse } from 'next'

import { IItem } from '@/app/types'

let items: IItem[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { id },
  } = req

  const item = items.find((item) => item.id === id)

  if (!item) {
    return res.status(404).json({ message: 'Item não encontrado' })
  }

  switch (method) {
    case 'GET':
      return res.status(200).json(item)

    case 'PUT':
      const { name, description, priority } = req.body
      if (!name || !description || !priority) {
        return res.status(400).json({ message: 'Preencha todos os campos' })
      }

      item.name = name
      item.description = description
      item.priority = priority
      return res.status(200).json(item)

    case 'DELETE':
      items = items.filter((item) => item.id !== id)
      return res.status(204).end()

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}

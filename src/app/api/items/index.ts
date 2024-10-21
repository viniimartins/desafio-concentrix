import { NextApiRequest, NextApiResponse } from 'next'

import { IItem } from '@/app/types'

const items: IItem[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      return res.status(200).json(items)

    case 'POST':
      const { name, description, priority } = req.body

      if (!name || !description || !priority) {
        return res.status(400).json({ message: 'Preencha todos os campos' })
      }

      const newItem: IItem = {
        id: crypto.randomUUID(),
        name,
        description,
        priority,
        createdAt: new Date(),
      }

      items.push(newItem)
      return res.status(201).json(newItem)

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}

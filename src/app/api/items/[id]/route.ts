import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params

  await prisma.item.delete({
    where: { id },
  })

  return NextResponse.json({ msg: 'Item deleted' }, { status: 200 })
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const { name, description, priority } = await request.json()

  const updatedItem = await prisma.item.update({
    where: { id },
    data: {
      name,
      description,
      priority,
    },
  })

  return NextResponse.json(updatedItem, { status: 200 })
}

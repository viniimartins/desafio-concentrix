import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET() {
  const items = await prisma.item.findMany()
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const { name, description, priority } = await request.json()

  const newItem = await prisma.item.create({
    data: {
      name,
      description,
      priority,
    },
  })

  return NextResponse.json(newItem, { status: 201 })
}

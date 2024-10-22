import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const priority = searchParams.get('priority');

  const items = await prisma.item.findMany({
    where: {
      name: name ? { contains: name } : undefined,
      priority: priority ? priority : undefined,
    }
  });

  return NextResponse.json(items);
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

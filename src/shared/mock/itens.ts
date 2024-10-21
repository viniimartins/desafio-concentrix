import { IItem } from "@/app/(panel)/types";

const mock: IItem = {
  id: crypto.randomUUID(),
  description: 'Teste',
  name: 'Teste',
  priority: 'high',
  createdAt: Date.now().toString()
}

const content = Array.from({ length: 8 }, (_, index) => ({
  ...mock,
  id: mock.id + index,
}))

export const ItemMock = content

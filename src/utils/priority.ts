import { Priority } from '@/app/(panel)/types'

export const priorityValue = (value: Priority) => {
  switch (value) {
    case 'low':
      return { variant: 'outline' as const, name: 'Baixa' }
    case 'medium':
      return { variant: 'default' as const, name: 'Média' }
    case 'high':
      return { variant: 'destructive' as const, name: 'Alta' }
    default:
      return { variant: 'default' as const, name: 'Não encontrado' }
  }
}

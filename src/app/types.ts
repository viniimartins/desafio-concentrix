type Priority = 'high' | 'medium' | 'low'

export interface IItem {
  id: string
  name: string
  description: string
  createdAt: Date
  priority: Priority
}

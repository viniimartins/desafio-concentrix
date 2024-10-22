import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUpdateItem } from './hooks/use-update-item'
import { useCreateItem } from './hooks/use-create-item'
import { Input } from '@/components/ui/input'
import { IItem } from './types'
import { QueryKey } from '@tanstack/react-query'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { ModalActions } from '@/types/modal'


interface Props {
  toUpdateModalItem: IItem | null
  queryKey: QueryKey
  actionsModalItem: ModalActions<IItem>
}

const itemSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome do item deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().min(3, {
    message: 'A descrição do item deve ter pelo menos 3 caracteres.',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Por favor, selecione a prioridade do item.',
  }),
})

type IAddItemFormData = z.infer<typeof itemSchema>

export function FormContainer(props: Props) {
  const { toUpdateModalItem, queryKey, actionsModalItem } = props

  const { mutateAsync: handleCreateItem, isPending: isPendingCreateItem } =
    useCreateItem({
      queryKey,
    })

  const { mutateAsync: handleUpdateitem, isPending: isPendingUpdateItem } =
    useUpdateItem({
      queryKey,
    })

  const form = useForm<IAddItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      description: '',
      name: '',
      priority: undefined,
    },
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  useEffect(() => {
    reset({
      name: toUpdateModalItem?.name,
      description: toUpdateModalItem?.description,
      priority: toUpdateModalItem?.priority,
    })
  }, [reset, toUpdateModalItem])

  function onSubmit(itemData: IAddItemFormData) {
    if (!toUpdateModalItem) {
      handleCreateItem(
        { item: itemData },
        {
          onSuccess: () => {
            toast({
              variant: 'success',
              title: 'Item criado com sucesso!',
              description: 'O item foi adicionado à lista.',
            })
          },
        },
      )
    }

    if (toUpdateModalItem) {
      handleUpdateitem(
        { item: { ...itemData, id: toUpdateModalItem.id } },
        {
          onSuccess: () => {
            toast({
              variant: 'success',
              title: 'Item editado com sucesso!',
              description: 'O item foi atualiado na lista.',
            })
          },
        },
      )
    }

    actionsModalItem.close()
    reset()
  }

  const isLoading =
    isPendingCreateItem ||
    isPendingUpdateItem ||
    isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do item" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite a descrição do item"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          Salvar
          {isLoading && (
            <LoaderCircle size={18} className="animate-spin" />
          )}
        </Button>
      </form>
    </Form>
  )
}
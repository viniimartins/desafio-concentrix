'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModal } from '@/hooks/use-modal'
import { toast } from '@/hooks/use-toast'

import { columns } from './components/table/columns'
import { DataTable } from './components/table/data-table'
import { useCreateItem } from './hooks/use-create-item'
import { useGetItem } from './hooks/use-get-item'
import { IItem } from './types'

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

export function Content() {
  const {
    isOpen: isOpenModalItem,
    actions: actionsModalItem,
    target: toUpdateModalItem,
  } = useModal<IItem>()

  const { data: itens, queryKey } = useGetItem()

  const { mutateAsync: handleCreateItem, isPending } = useCreateItem({
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

    actionsModalItem.close()
    reset()
  }

  const isLoading = isPending || isSubmitting

  const handleOpenModal = () => {
    reset()
    actionsModalItem.open()
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={handleOpenModal}>Adicionar Item</Button>
      </div>

      {itens && <DataTable columns={columns(actionsModalItem)} data={itens} />}

      <Dialog open={isOpenModalItem} onOpenChange={actionsModalItem.close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
            <DialogDescription>Preencha os detalhes do item.</DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </>
  )
}

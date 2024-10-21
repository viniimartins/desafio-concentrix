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

import { columns } from './components/table/columns'
import { DataTable } from './components/table/data-table'
import { useGetItem } from './hooks/use-get-item'
import { IItem } from './types'

const itemSchema = z.object({
  name: z.string().min(2, {
    message: 'Selecione o nome do item',
  }),
  description: z.string().min(2, {
    message: 'Selecione descrição do item',
  }),
  priority: z.string({
    required_error: 'Selecione a prioridade do item',
  }),
})

type IAddItemFormData = z.infer<typeof itemSchema>

export function Content() {
  const { isOpen, actions } = useModal<IItem>()
  const { data: itens } = useGetItem()

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

  function onSubmit({ description, name, priority }: IAddItemFormData) {
    console.log('TESTE')

    actions.close()
    reset()
  }

  const handleOpenModal = () => {
    reset()
    actions.open()
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={handleOpenModal}>Adicionar Item</Button>
      </div>

      {itens && <DataTable columns={columns} data={itens} />}

      <Dialog open={isOpen} onOpenChange={actions.close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adiciona item?</DialogTitle>
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
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite a descição do item"
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

              <Button type="submit">
                Salvar
                {isSubmitting && (
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

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { format } from "date-fns";

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
import { priorityValue } from '@/utils/priority'

import { DataTable } from './components/table/data-table'
import { useDeleteItem } from './hooks/use-delete-item'
import { useGetItem } from './hooks/use-get-item'
import { IItem, Priority } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import { FormContainer } from './form'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const searchsInputs = z.object({
  name: z.string(),
  priority: z.enum(['low', 'medium', 'high'])
})

type ISearchInputs = z.infer<typeof searchsInputs>

export function Content() {
  const {
    isOpen: isOpenModalItem,
    actions: actionsModalItem,
    target: toUpdateModalItem,
  } = useModal<IItem>()

  const {
    isOpen: isOpenAlertDialogItem,
    actions: actionsAlertDialogItem,
    target: toDeleteAlertDialogItem,
  } = useModal<IItem>()

  const { register, watch, setValue } = useForm<ISearchInputs>()
  const { name: searchNameItemValue, priority: searchPriorityValue } = watch()
  const { data: items, queryKey, isFetching } = useGetItem({ name: searchNameItemValue, priority: searchPriorityValue })

  const { mutateAsync: deleteItem, isPending: isPendingDeleteItem } =
    useDeleteItem({ queryKey })

  const handleDeleteItem = (id: string) => {
    deleteItem({ itemId: id }, {
      onSuccess: () => {
        toast({
          variant: 'success',
          title: 'Item excluido com sucesso!',
          description: 'O item foi excluido à lista.',
        })
      },
    })
    actionsAlertDialogItem.close()
  }

  const columns: ColumnDef<IItem>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      size: 37.5,
      minSize: 37.5,
      maxSize: 37.5,
      enableSorting: true,
      cell: ({ row }) => {
        const value = row.original.name
        return (
          <span>
            {isFetching ? <Skeleton className='w-[37.5rem] h-[1rem]' /> : value}
          </span>
        )
      },
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      size: 25,
      minSize: 25,
      maxSize: 25,
      enableSorting: true,
      cell: ({ row }) => {
        const value = row.original.description
        return (
          <span>
            {isFetching ? <Skeleton className='w-[25rem] h-[1rem]' /> : value}
          </span>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: 'Prioridade',
      size: 25,
      minSize: 25,
      maxSize: 25,
      enableSorting: true,
      cell: ({ row }) => {
        const value = row.original.priority
        const { variant, name } = priorityValue(value)

        return (
          <span>
            {isFetching ? <Skeleton className='w-[6rem] h-[1rem]' /> : <Badge variant={variant}>{name}</Badge>}
          </span>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Data de criação',
      size: 25,
      minSize: 25,
      maxSize: 25,
      enableSorting: true,
      cell: ({ row }) => {
        const value = row.original.createdAt

        return (
          <span>
            {isFetching ? <Skeleton className='w-[6rem] h-[1rem]' /> : format(value, "dd/MM/yyyy")}
          </span>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Ações',
      size: 12.5,
      minSize: 12.5,
      maxSize: 12.5,
      cell: ({ row }) => {
        const item = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-[2rem] w-[2rem] p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-[1rem] w-[1rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => actionsModalItem.open(item)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => actionsAlertDialogItem.open(item)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <>
      <div className='w-full flex justify-between'>
        <div className='flex gap-4'>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome"
              {...register('name')}
              className="pl-8 w-50"
            />
          </div>

          <Select onValueChange={(value: Priority) => setValue('priority', value)} defaultValue={searchPriorityValue}>
            <SelectTrigger className='w-56'>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => actionsModalItem.open()}>Adicionar Item</Button>
      </div >


      {items && <DataTable columns={columns} data={items} />
      }

      <Dialog open={isOpenModalItem} onOpenChange={actionsModalItem.close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
            <DialogDescription>Preencha os detalhes do item.</DialogDescription>
          </DialogHeader>
          <FormContainer toUpdateModalItem={toUpdateModalItem} queryKey={queryKey} actionsModalItem={actionsModalItem} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isOpenAlertDialogItem}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente deletar este item?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá remover permanentemente o item
              e todos os dados associados a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={actionsAlertDialogItem.close}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteItem(toDeleteAlertDialogItem?.id ?? '')}
            >Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

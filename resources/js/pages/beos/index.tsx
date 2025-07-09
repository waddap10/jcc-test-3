import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Megaphone } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Banquet Event Order', href: '/beos' },
]

interface Order {
  id: number
  event_name: string
}

interface PageProps {
  orders: Order[]
  flash: {
    message?: string
  }
  [key: string]: unknown
}

export default function Index() {
  const { orders, flash } = usePage().props as unknown as PageProps;
  const { processing} = useForm()

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Banquet Event Order" />

      

      {flash.message && (
        <Alert className='m-4'>
          <Megaphone className="h-4 w-4" />
          <AlertTitle>Notification</AlertTitle>
          <AlertDescription>{flash.message}</AlertDescription>
        </Alert>
      )}

      {orders.length > 0 ? (
        <Table>
          <TableCaption>List of all venue reservations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Event Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => {
              return (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.event_name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={route('beos.show', o.id)}>
                      <Button className="bg-blue-500 hover:bg-blue-700">
                        Check List BEO
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="px-4 py-10 text-center text-gray-500">
          No Event found.
        </div>
      )}
    </AppLayout>
  )
}
// resources/js/Pages/Orders/Index.tsx
import React from 'react'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Megaphone } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Orders', href: '/orders' },
]

interface Venue {
  id: number
  name: string
}

interface Customer {
  organizer: string
}

interface Order {
  id: number
  event_name: string
  customer?: Customer
  load_start?: string
  load_end?: string
  show_start?: string
  show_end?: string
  unload_start?: string
  unload_end?: string
  status: number
  venues?: Venue[]
}

interface PageProps {
  orders: Order[]
  flash: { message?: string }
  [key: string]: unknown
}

export default function Index() {
  const { orders, flash } = usePage().props as unknown as PageProps
  const { processing, delete: destroy, patch } = useForm()

  const handleDelete = (o: Order) => {
    if (confirm(`Delete #${o.id}: ${o.event_name}?`)) {
      destroy(route('orders.destroy', o.id))
    }
  }

  const handleMarkPaid = (o: Order) => {
    if (confirm(`Mark order #${o.id} as Paid?`)) {
      patch(route('orders.status.update', o.id))
    }
  }

  const formatRange = (start?: string, end?: string) => {
    if (!start && !end) return '—'
    const s = start ? new Date(start).toLocaleDateString() : '—'
    const e = end ? new Date(end).toLocaleDateString() : '—'
    return `${s} – ${e}`
  }

  // Map status codes to label + background color
  const getStatusProps = (status: number) => {
    switch (status) {
      case 0:
        return { label: 'New Inquiry', bgcolor: '#A5D6A7' }    // light green
      case 1:
        return { label: 'Sudah Konfirmasi', bgcolor: '#FFF59D' } // light yellow
      case 2:
        return { label: 'Sudah dilaksanakan', bgcolor: '#90CAF9' } // light blue
      default:
        return { label: 'Unknown', bgcolor: '#E0E0E0' }         // gray
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Reservations" />

      <div className="flex justify-between items-center mb-6 px-4">
        <h1 className="text-2xl font-semibold">All Reservations</h1>
        <Link href={route('orders.create')}>
          <Button>New Reservation</Button>
        </Link>
      </div>

      {flash.message && (
        <Alert className="mb-6 mx-4">
          <Megaphone className="h-4 w-4" />
          <AlertTitle>Notification</AlertTitle>
          <AlertDescription>{flash.message}</AlertDescription>
        </Alert>
      )}

      {orders.length > 0 ? (
        <Table>
          <TableCaption>List of all reservations</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Event Name</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Load</TableHead>
              <TableHead>Show</TableHead>
              <TableHead>Unload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((o) => {
              const { label, bgcolor } = getStatusProps(o.status)

              return (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.event_name}</TableCell>
                  <TableCell>{o.customer?.organizer || '—'}</TableCell>

                  <TableCell>{formatRange(o.load_start, o.load_end)}</TableCell>
                  <TableCell>{formatRange(o.show_start, o.show_end)}</TableCell>
                  <TableCell>{formatRange(o.unload_start, o.unload_end)}</TableCell>

                  <TableCell style={{ backgroundColor: bgcolor }}>
                    {label}
                  </TableCell>

                  <TableCell>
                    {(o.venues?.length ?? 0) > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {o.venues!.map((v) => (
                          <li key={v.id}>{v.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No venues</p>
                    )}
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Link href={route('orders.edit', o.id)}>
                      <Button className="bg-blue-500 hover:bg-blue-700">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      disabled={processing}
                      onClick={() => handleDelete(o)}
                      className="bg-red-500 hover:bg-red-700"
                    >
                      Delete
                    </Button>

                    {o.status === 0 && (
                      <Button
                        disabled={processing}
                        onClick={() => handleMarkPaid(o)}
                        className="bg-yellow-500 hover:bg-yellow-700"
                      >
                        Mark Paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="px-4 py-10 text-center text-gray-500">
          No reservations found.
        </div>
      )}
    </AppLayout>
  )
}
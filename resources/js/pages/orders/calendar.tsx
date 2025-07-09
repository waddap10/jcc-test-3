// resources/js/Pages/Orders/Calendar.tsx

import { Head, Link } from '@inertiajs/react'
import { addMonths, subMonths, format } from 'date-fns'
import AppLayout from '@/layouts/app-layout'
import {
  Table, TableCaption, TableHeader, TableBody,
  TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { type BreadcrumbItem } from '@/types'

interface Venue { id: number; name: string }
interface MatrixRow { date: string; [vid: number]: string|null }
interface Props {
  venues: Venue[]
  calendarData: MatrixRow[]
  month: number
  year: number
}

export default function Calendar({ venues, calendarData, month, year }: Props) {
  const current = new Date(year, month - 1, 1)
  const prev    = subMonths(current, 1)
  const next    = addMonths(current, 1)

  return (
    <AppLayout breadcrumbs={[
      { title: 'Calendar', href: '/orders/calendar' },
    ]}>
      <Head title="Venue Booking Calendar" />

      <div className="px-4 py-6 space-y-4">
        {/* month nav */}
        <div className="flex items-center justify-between">
          <Link
            href={route('orders.calendar', {
              month: prev.getMonth() + 1,
              year:  prev.getFullYear(),
            })}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← {format(prev, 'MMM yyyy')}
          </Link>

          <h1 className="text-2xl font-semibold">
            {format(current, 'MMMM yyyy')}
          </h1>

          <Link
            href={route('orders.calendar', {
              month: next.getMonth() + 1,
              year:  next.getFullYear(),
            })}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            {format(next, 'MMM yyyy')} →
          </Link>
        </div>

        {/* the table */}
        <Table>
          <TableCaption>Availability for {format(current, 'MMMM yyyy')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Date</TableHead>
              {venues.map(v => (
                <TableHead key={v.id} className="text-center">{v.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {calendarData.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {format(new Date(row.date), 'MM/dd/yyyy')}
                </TableCell>
                {venues.map(v => {
                  const evt = row[v.id]
                  return (
                    <TableCell
                      key={v.id}
                      className={`text-center text-sm ${
                        evt
                          ? 'bg-red-200 text-red-800 font-semibold'
                          : 'text-gray-600'
                      }`}
                    >
                      {evt ?? '—'}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  )
}
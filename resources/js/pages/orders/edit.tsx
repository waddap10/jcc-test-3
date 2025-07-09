// resources/js/Pages/Orders/Edit.tsx

import React, { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { isWithinInterval, parseISO, format } from 'date-fns'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Orders', href: '/orders' },
  { title: 'Edit',   href: '#' },
]

interface Venue {
  id: number
  name: string
}

interface Booking {
  venue_id: number
  start: string
  end: string
}

interface InitialData {
  venues: number[]
  started_at: string
  ended_at: string
  event_name: string
  description: string
  customer: {
    name: string
    address: string
    email: string
    phone: string
  }
  [key: string]: any
}

interface Props {
  venues: Venue[]
  bookings: Booking[]
  initialData: InitialData
  orderId: number
  flash: { message?: string }
}

export default function Edit({ venues, bookings, initialData, orderId, flash }: Props) {
  const [step, setStep] = useState(1)

  const { data, setData, put, processing, errors } = useForm<InitialData>(initialData)

  // Build a map: venue_id → its bookings
  const bookingsMap = data.venues.reduce<Record<number,Booking[]>>((acc, vid) => {
    acc[vid] = bookings.filter(b => b.venue_id === vid)
    return acc
  }, {})

  function onDateChange(
    value: Date | [Date | null, Date | null] | null
  ) {
    if (!Array.isArray(value)) return
    const [start, end] = value
    if (start && end) {
      setData('started_at', format(start, 'yyyy-MM-dd'))
      setData('ended_at',   format(end,   'yyyy-MM-dd'))
    }
  }

  function next() { setStep(s => Math.min(2, s + 1)) }
  function back() { setStep(s => Math.max(1, s - 1)) }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    put(route('orders.update', orderId))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Reservation" />

      {flash.message && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{flash.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={submit} className="space-y-6 px-4 py-6">
        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Select Venue & Dates</h2>

            <div>
              <label className="block font-medium">Venues</label>
              {venues.map(v => (
                <label key={v.id} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={data.venues.includes(v.id)}
                    onChange={() => {
                      const next = data.venues.includes(v.id)
                        ? data.venues.filter(id => id !== v.id)
                        : [...data.venues, v.id]
                      setData('venues', next)
                    }}
                    className="mr-2"
                  />
                  {v.name}
                </label>
              ))}
              {errors.venues && <p className="text-red-600">{errors.venues}</p>}
            </div>

            {data.venues.length > 0 && (
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${data.venues.length}, minmax(0,1fr))` }}
              >
                {data.venues.map(vid => (
                  <div key={vid} className="border rounded p-2">
                    <p className="mb-2 font-medium">
                      {venues.find(v => v.id === vid)?.name}
                    </p>
                    <Calendar
                      selectRange
                      onChange={onDateChange}
                      value={
                        data.started_at && data.ended_at
                          ? [parseISO(data.started_at), parseISO(data.ended_at)]
                          : null
                      }
                      tileClassName={({ date, view }) => {
                        if (view !== 'month') return undefined
                        const isBooked = bookingsMap[vid]?.some(b =>
                          isWithinInterval(date, {
                            start: parseISO(b.start),
                            end:   parseISO(b.end),
                          })
                        )
                        return isBooked ? 'booked-date' : undefined
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {errors.started_at && <p className="text-red-600">{errors.started_at}</p>}
            {errors.ended_at   && <p className="text-red-600">{errors.ended_at}</p>}

            <div className="flex justify-end space-x-2">
              <Button onClick={next} disabled={processing}>Next</Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Event & Customer Info</h2>

            <div>
              <label className="block font-medium">Event Name</label>
              <input
                type="text"
                value={data.event_name}
                onChange={e => setData('event_name', e.target.value)}
                className="mt-1 block w-full border px-2 py-1"
              />
              {errors.event_name && <p className="text-red-600">{errors.event_name}</p>}
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                className="mt-1 block w-full border px-2 py-1"
              />
              {errors.description && <p className="text-red-600">{errors.description}</p>}
            </div>

            <fieldset className="space-y-4">
              <legend className="font-medium">Customer Details</legend>

              <div>
                <label className="block">Name</label>
                <input
                  type="text"
                  value={data.customer.name}
                  onChange={e => setData('customer', { ...data.customer, name: e.target.value })}
                  className="mt-1 block w-full border px-2 py-1"
                />
                
              </div>

              <div>
                <label className="block">Address</label>
                <input
                  type="text"
                  value={data.customer.address}
                  onChange={e => setData('customer', { ...data.customer, address: e.target.value })}
                  className="mt-1 block w-full border px-2 py-1"
                />
                
              </div>

              <div>
                <label className="block">Email</label>
                <input
                  type="email"
                  value={data.customer.email}
                  onChange={e => setData('customer', { ...data.customer, email: e.target.value })}
                  className="mt-1 block w-full border px-2 py-1"
                />
                
              </div>

              <div>
                <label className="block">Phone</label>
                <input
                  type="tel"
                  value={data.customer.phone}
                  onChange={e => setData('customer', { ...data.customer, phone: e.target.value })}
                  className="mt-1 block w-full border px-2 py-1"
                />
                
              </div>
            </fieldset>

            <div className="flex justify-between space-x-2">
              <Button variant="secondary" onClick={back} disabled={processing}>Back</Button>
              <Button type="submit" disabled={processing}>Update Reservation</Button>
            </div>
          </section>
        )}
      </form>
    </AppLayout>
  )
}
// resources/js/Pages/Orders/Edit.tsx

import React, { useState, useEffect } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import Calendar, { CalendarProps } from 'react-calendar'
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

type ScheduleType = 'load' | 'show' | 'unload'

interface Venue { id: number; name: string }
interface Booking {
  venue_id: number
  load_start: string;  load_end: string
  show_start: string;  show_end: string
  unload_start: string;unload_end: string
}
interface Department { id: number; name: string }
interface BeoEntry {
  department_id?: number
  description?: string
}

interface FormData {
  [key: string]: any
  venues: number[]

  load_start: string
  load_end: string
  show_start: string
  show_end: string
  unload_start: string
  unload_end: string

  event_name: string
  customer: {
    organizer: string
    address: string
    contact_person: string
    phone: string
    email: string
  }

  beos: BeoEntry[]
}

interface Props {
  orderId: number
  venues: Venue[]
  bookings: Booking[]
  departments: Department[]
  initialData: FormData
  flash: { message?: string }
}

export default function Edit({
  orderId,
  venues,
  bookings,
  departments,
  initialData,
  flash,
}: Props) {
  const [step, setStep] = useState<number>(1)

  // Initialize form with existing data
  const { data, setData, put, processing, errors } = 
    useForm<FormData>(initialData)

  // Define the three phases
  const scheduleTypes: { key: ScheduleType; label: string }[] = [
    { key: 'load',   label: 'Load-In' },
    { key: 'show',   label: 'Showtime' },
    { key: 'unload', label: 'Unload' },
  ]

  // Re-fetch bookings whenever venues change
  useEffect(() => {
    if (!data.venues.length) return
    router.get(
      route('orders.edit', orderId),
      { venues: data.venues },
      { only: ['bookings'], preserveState: true, replace: true }
    )
  }, [data.venues])

  // Map venue → its bookings
  const bookingsMap = data.venues.reduce<Record<number, Booking[]>>(
    (acc, vid) => {
      acc[vid] = bookings.filter(b => b.venue_id === vid)
      return acc
    },
    {}
  )

  // Flatten all intervals for each venue
  const blockedMap = Object.fromEntries(
    Object.entries(bookingsMap).map(([vid, bs]) => {
      const intervals = bs.flatMap((b) =>
        scheduleTypes.map(({ key }) => {
          const s = b[`${key}_start` as
            | 'load_start'
            | 'show_start'
            | 'unload_start']
          const e = b[`${key}_end` as
            | 'load_end'
            | 'show_end'
            | 'unload_end']
          if (!s || !e) return null
          return { start: parseISO(s), end: parseISO(e) }
        }).filter((x): x is { start: Date; end: Date } => !!x)
      )
      return [Number(vid), intervals]
    })
  ) as Record<number, { start: Date; end: Date }[]>

  // Handler for calendar range selection
  const handleRangeChange =
    (type: ScheduleType): CalendarProps['onChange'] =>
      (value) => {
        if (!Array.isArray(value) || value.length < 2) return
        const [s, e] = value as [Date, Date]
        setData(`${type}_start`, format(s, 'yyyy-MM-dd'))
        setData(`${type}_end`,   format(e, 'yyyy-MM-dd'))
      }

  function updateBeoField(
    idx: number,
    field: keyof BeoEntry,
    val: number | string | undefined
  ) {
    const newBeos = data.beos.map((b, i) =>
      i === idx ? { ...b, [field]: val } : b
    )
    setData('beos', newBeos)
  }

  function next() { setStep(s => Math.min(3, s + 1)) }
  function back() { setStep(s => Math.max(1, s - 1)) }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    put(route('orders.update', orderId))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Reservation" />

      {flash.message && (
        <Alert className="mb-4 mx-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{flash.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={submit} className="space-y-6 px-4 py-6">
        {/* Step 1: Venue & Schedules */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Step 1: Venues & Schedules
            </h2>

            {/* Venue Selection */}
            <div>
              <label className="block font-medium mb-2">
                Select Venues
              </label>
              <div className="flex flex-wrap gap-4">
                {venues.map(v => (
                  <label key={v.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={data.venues.includes(v.id)}
                      onChange={() =>
                        setData(
                          'venues',
                          data.venues.includes(v.id)
                            ? data.venues.filter(x => x !== v.id)
                            : [...data.venues, v.id]
                        )
                      }
                    />
                    {v.name}
                  </label>
                ))}
              </div>
              {errors.venues && (
                <p className="text-red-600 mt-1">{errors.venues}</p>
              )}
            </div>

            {/* Calendars for each schedule */}
            {data.venues.length > 0 &&
              scheduleTypes.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <p className="font-medium">{label} Window</p>
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${data.venues.length},1fr)`,
                    }}
                  >
                    {data.venues.map(vid => {
                      const blocked = blockedMap[vid] || []
                      return (
                        <div key={vid} className="border rounded p-2">
                          <p className="mb-1 text-sm font-semibold">
                            {venues.find(x => x.id === vid)?.name}
                          </p>
                          <Calendar
                            selectRange
                            onChange={handleRangeChange(key)}
                            value={
                              data[`${key}_start`] &&
                              data[`${key}_end`]
                                ? [
                                    parseISO(data[`${key}_start`]),
                                    parseISO(data[`${key}_end`]),
                                  ]
                                : null
                            }
                            tileClassName={({ date, view }) => {
                              if (view !== 'month') return undefined
                              const isBooked = blocked.some(({ start, end }) =>
                                isWithinInterval(date, { start, end })
                              )
                              return isBooked ? 'booked-date' : undefined
                            }}
                            tileDisabled={({ date, view }) => {
                              if (view !== 'month') return false
                              return blocked.some(({ start, end }) =>
                                isWithinInterval(date, { start, end })
                              )
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                  {errors[`${key}_start`] && (
                    <p className="text-red-600 text-sm">
                      {errors[`${key}_start`]}
                    </p>
                  )}
                  {errors[`${key}_end`] && (
                    <p className="text-red-600 text-sm">
                      {errors[`${key}_end`]}
                    </p>
                  )}
                </div>
              ))}

            <div className="flex justify-end">
              <Button
                onClick={next}
                disabled={
                  processing ||
                  !data.venues.length ||
                  !data.load_start ||
                  !data.load_end ||
                  !data.show_start ||
                  !data.show_end ||
                  !data.unload_start ||
                  !data.unload_end
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Event & Customer */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Step 2: Event & Customer
            </h2>

            <div>
              <label className="block text-sm font-medium">
                Event Name
              </label>
              <input
                type="text"
                value={data.event_name}
                onChange={e =>
                  setData('event_name', e.target.value)
                }
                className="mt-1 block w-full rounded border px-2 py-1"
              />
              {errors.event_name && (
                <p className="text-red-600 text-sm">
                  {errors.event_name}
                </p>
              )}
            </div>

            {(
              [
                'organizer',
                'address',
                'contact_person',
                'phone',
                'email',
              ] as Array<keyof FormData['customer']>
            ).map(field => (
              <div key={field}>
                <label className="block text-sm font-medium">
                  {field
                    .replace('_', ' ')
                    .replace(/\b\w/g, c => c.toUpperCase())}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={data.customer[field]}
                  onChange={e =>
                    setData('customer', {
                      ...data.customer,
                      [field]: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded border px-2 py-1"
                />
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button onClick={next}>Next</Button>
            </div>
          </div>
        )}

        {/* Step 3: Department & Description */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Step 3: Department & Description
            </h2>

            {data.beos.map((b, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 gap-4 items-end"
              >
                <div>
                  <label className="block text-sm font-medium">
                    Department
                  </label>
                  <select
                    value={b.department_id ?? ''}
                    onChange={e =>
                      updateBeoField(
                        idx,
                        'department_id',
                        e.target.value
                          ? Number(e.target.value)
                          : undefined
                      )
                    }
                    className="mt-1 block w-full rounded border px-2 py-1"
                  >
                    <option value="">Select department</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <input
                    type="text"
                    value={b.description || ''}
                    onChange={e =>
                      updateBeoField(
                        idx,
                        'description',
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full rounded border px-2 py-1"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setData(
                      'beos',
                      data.beos.filter((_, i) => i !== idx)
                    )
                  }
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setData('beos', [
                  ...data.beos,
                  { department_id: undefined, description: '' },
                ])
              }
            >
              + Add Department
            </Button>

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
              <Button
                disabled={processing}
                type="submit"
                className="mt-4"
              >
                Update Reservation
              </Button>
            </div>
          </div>
        )}
      </form>
    </AppLayout>
  )
}
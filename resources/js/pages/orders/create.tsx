// resources/js/Pages/Orders/Create.tsx
import React, { useState } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Orders', href: '/orders' },
  {
    title: 'New Reservation',
    href: ''
  },
]

interface Department {
  id: number
  name: string
}

interface PageProps {
  departments: Department[]
}

export default function Create() {
  const { departments } = usePage().props as unknown as PageProps
  const [step, setStep] = useState(1)

  const form = useForm({
    // Step 1: schedules
    load_start: '',
    load_end: '',
    show_start: '',
    show_end: '',
    unload_start: '',
    unload_end: '',
    // Step 2: event & organizer
    event_name: '',
    customer: {
      organization: '',
      address: '',
      contact_person: '',
      phone: '',
      email: '',
    },
    // Step 3: departments
    beos: [
      {
        department_id: null as number | null,
        description: '',
      },
    ],
  })

  const next = () => setStep((s) => Math.min(3, s + 1))
  const prev = () => setStep((s) => Math.max(1, s - 1))

  const submit = () => {
    form.post(route('orders.store'), {
      onSuccess: () => {
        // optionally reset or redirect
      },
    })
  }

  const addBeo = () => {
    form.setData('beos', [
      ...form.data.beos,
      { department_id: null, description: '' },
    ])
  }

  const removeBeo = (index: number) => {
    form.setData(
      'beos',
      form.data.beos.filter((_, i) => i !== index)
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="New Reservation" />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (step < 3) next()
          else submit()
        }}
        className="space-y-6 p-4"
      >
        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Step 1: Schedules</h2>

            {([
              { label: 'Load-in', start: 'load_start', end: 'load_end' },
              { label: 'Show', start: 'show_start', end: 'show_end' },
              { label: 'Unload', start: 'unload_start', end: 'unload_end' },
            ] as { label: string; start: keyof typeof form.data; end: keyof typeof form.data }[]).map(
              ({ label, start, end }) => (
                <div key={label} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      {label} Start
                    </label>
                    <input
                      type="date"
                      value={String(form.data[start] ?? '')}
                      onChange={(e) =>
                        form.setData(start, e.target.value)
                      }
                      className="mt-1 block w-full rounded border px-2 py-1"
                    />

                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      {label} End
                    </label>
                    <input
                      type="date"
                      value={String(form.data[end] ?? '')}
                      onChange={(e) =>
                        form.setData(end as any, e.target.value)
                      }
                      className="mt-1 block w-full rounded border px-2 py-1"
                    />

                  </div>
                </div>
              ))}
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Step 2: Event & Organizer
            </h2>

            <div>
              <label className="block text-sm font-medium">
                Event Name
              </label>
              <input
                type="text"
                value={form.data.event_name}
                onChange={(e) =>
                  form.setData('event_name', e.target.value)
                }
                className="mt-1 block w-full rounded border px-2 py-1"
              />
              {form.errors.event_name && (
                <p className="text-red-600 text-sm">
                  {form.errors.event_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Organization
              </label>
              <input
                type="text"
                value={form.data.customer.organization}
                onChange={(e) =>
                  form.setData('customer', {
                    ...form.data.customer,
                    organization: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded border px-2 py-1"
              />

            </div>

            <div>
              <label className="block text-sm font-medium">
                Address
              </label>
              <input
                type="text"
                value={form.data.customer.address}
                onChange={(e) =>
                  form.setData('customer', {
                    ...form.data.customer,
                    address: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded border px-2 py-1"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={form.data.customer.contact_person}
                  onChange={(e) =>
                    form.setData('customer', {
                      ...form.data.customer,
                      contact_person: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded border px-2 py-1"
                />

              </div>
              <div>
                <label className="block text-sm font-medium">
                  Phone
                </label>
                <input
                  type="text"
                  value={form.data.customer.phone}
                  onChange={(e) =>
                    form.setData('customer', {
                      ...form.data.customer,
                      phone: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded border px-2 py-1"
                />

              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value={form.data.customer.email}
                onChange={(e) =>
                  form.setData('customer', {
                    ...form.data.customer,
                    email: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded border px-2 py-1"
              />

            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">
              Step 3: Departments & Description
            </h2>

            {form.data.beos.map((b, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 gap-4 items-end"
              >
                <div className="col-span-1">
                  <label className="block text-sm font-medium">
                    Department
                  </label>
                  <select
                    value={b.department_id ?? ''}
                    onChange={(e) => {
                      const newBeos = [...form.data.beos]
                      newBeos[idx] = {
                        ...newBeos[idx],
                        department_id: e.target.value ? Number(e.target.value) : null,
                      }
                      form.setData('beos', newBeos)
                    }}
                    className="mt-1 block w-full rounded border px-2 py-1"
                  >
                    <option value="">Select...</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium">
                    <input
                      type="text"
                      value={b.description}
                      onChange={(e) => {
                        const newBeos = [...form.data.beos]
                        newBeos[idx] = {
                          ...newBeos[idx],
                          description: e.target.value,
                        }
                        form.setData('beos', newBeos)
                      }}
                      className="mt-1 block w-full rounded border px-2 py-1"
                    />
                    className="mt-1 block w-full rounded border px-2 py-1"
                  </label>


                </div>

                {form.data.beos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBeo(idx)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addBeo}
              className="mt-2"
            >
              + Add Department
            </Button>
          </section>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button variant="secondary" onClick={prev}>
              Back
            </Button>
          )}
          <div className="ml-auto">
            {step < 3 ? (
              <Button type="button" onClick={next}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={form.processing}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </form>
    </AppLayout>
  )
}
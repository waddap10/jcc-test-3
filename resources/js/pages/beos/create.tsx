// resources/js/Pages/Assignments/Create.tsx

import React from 'react'
import { Head, useForm, usePage, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type BreadcrumbItem } from '@/types'
import { route } from 'ziggy-js'

interface Order {
  id: number
  event_name: string
}

interface Department {
  id: number
  name: string
}

interface Vendor {
  id: number
  name: string
  department_id: number
}

interface PageProps {
  order: Order
  departments: Department[]
  vendors: Vendor[]        // ← ensure this is here
  flash: { message?: string }
  [key: string]: unknown
}

export default function Create() {
  const { order, departments, vendors = [], flash } = usePage<PageProps>().props;

  const { data, setData, post, processing, errors } = useForm({
    order_id: order.id,
    department_id: '' as number | '',
    vendor_id: '' as number | '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route('beos.store', order.id))
  }

  // filter vendors by selected department
  const filteredVendors = vendors.filter(
    v => Number(data.department_id) === v.department_id
  );

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Banquet Event Orders', href: '/beos' },
    {
      title: `Assignments for ${order.event_name}`,
      href: `/beos/${order.id}`,
    },
    { title: 'New Assignment', href: '#' },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="New Assignment" />

      {flash.message && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{flash.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 px-4 py-6">
        {/* Event (read-only) */}
        <div>
          <Label>Event</Label>
          <p className="mt-1 text-gray-700">{order.event_name}</p>
        </div>

        {/* Department */}
        <div>
          <Label htmlFor="department_id">Department</Label>
          <select
            id="department_id"
            value={data.department_id}
            onChange={e =>
              setData('department_id', Number(e.currentTarget.value))
            }
            className="mt-1 block w-full border px-2 py-1"
          >
            <option value="">— Select Department —</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
          {errors.department_id && (
            <p className="text-red-600 text-sm mt-1">
              {errors.department_id}
            </p>
          )}
        </div>

        {/* Vendor */}
        <div>
          <Label htmlFor="vendor_id">Vendor</Label>
          <select
            id="vendor_id"
            value={data.vendor_id}
            onChange={e => setData('vendor_id', Number(e.currentTarget.value))}
            disabled={!data.department_id}
            className="mt-1 block w-full border px-2 py-1 disabled:bg-gray-100"
          >
            <option value="">— Select Vendor —</option>
            {filteredVendors.map(v => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          {errors.vendor_id && (
            <p className="text-red-600 text-sm mt-1">{errors.vendor_id}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={data.description}
            onChange={e => setData('description', e.currentTarget.value)}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Link
            href={route('beos.show', order.id)}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </Link>
          <Button type="submit" disabled={processing}>
            {processing ? 'Saving…' : 'Save Assignment'}
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}
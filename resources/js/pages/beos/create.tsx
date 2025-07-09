// resources/js/Pages/Assignments/Create.tsx

import React from 'react'
import { Head, useForm, usePage, Link, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { route } from 'ziggy-js'
import { type BreadcrumbItem } from '@/types'

interface Order {
  id: number
  event_name: string
}

interface Department {
  id: number
  name: string
}

interface BeoForm {
  [key: string]: any      // ← allows arbitrary nested paths
  department_id: number | null
  description: string
}


interface PageProps {
  order: Order
  departments: Department[]
  flash: { message?: string }
}

export default function Create() {
  const { order, departments, flash } = usePage().props as unknown as PageProps;

  // Initialize form with both fields
  const { data, setData, post, processing, errors } =
    useForm<BeoForm>({
      department_id: null,
      description:   '',
    })


  // Submit handler now sends `data` and navigates on success
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    post(
      route('beos.store', order.id)

    )
  }

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
        {/* Department */}
        <div>
          <Label htmlFor="department_id">Department</Label>
          <select
            id="department_id"
            value={data.department_id ?? ''}
            onChange={e =>
              setData(
                'department_id',
                e.currentTarget.value ? Number(e.currentTarget.value) : null
              )
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
            <p className="text-red-600 text-sm mt-1">
              {errors.description}
            </p>
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
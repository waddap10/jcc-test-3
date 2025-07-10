// resources/js/Pages/Beos/Edit.tsx

import React from 'react'
import { Head, useForm, usePage, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleAlert } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'BEOs', href: '/beos' },
  { title: 'Edit Assignment', href: '#' },
]

interface PageProps {
  beo: {
    id: number
    order_id: number
    order_name: string
    department_id: number
    department_name: string
    description: string
  }
  flash: { message?: string }
  [key: string]: any
}

export default function Edit() {
  const { beo, flash } = usePage<PageProps>().props

  // Only the description is editable
  const { data, setData, put, processing, errors } = useForm({
    description: beo.description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(route('beos.update', beo.id), {
      preserveScroll: true,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Assignment" />

      {flash.message && (
        <Alert className="mb-4 mx-4">
          <CircleAlert className="h-4 w-4 text-blue-500" />
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>{flash.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 px-4 py-6">
        {/* Read-only: Event Name */}
        <div>
          <Label>Event</Label>
          <p className="mt-1 px-3 py-2 bg-gray-100 rounded">
            {beo.order_name}
          </p>
        </div>

        {/* Read-only: Department */}
        <div>
          <Label>Department</Label>
          <p className="mt-1 px-3 py-2 bg-gray-100 rounded">
            {beo.department_name}
          </p>
        </div>

        {/* Editable: Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            className="mt-1"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex justify-between">
          <Link href={route('beos.show', beo.order_id)}>
            <Button variant="secondary">Back to List</Button>
          </Link>
          <Button type="submit" disabled={processing}>
            Update
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}
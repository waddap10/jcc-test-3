import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, useForm } from '@inertiajs/react'
import { Inertia } from '@inertiajs/inertia'
import { route } from 'ziggy-js'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleAlert } from 'lucide-react'

interface Venue {
  id: number
  name: string
  photo: string           // stored path, e.g. "venues/photos/xyz.jpg"
  description: string
  dimension_m: string
  dimension_f: string
  setup_banquet: number
  setup_classroom: number
  setup_theater: number
  setup_reception: number
  floor_plan: string      
}

interface Props {
  venue: Venue
}

export default function Edit({ venue }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: venue.name,
    description: venue.description,
    dimension_m: venue.dimension_m,
    dimension_f: venue.dimension_f,
    setup_banquet: venue.setup_banquet.toString(),
    setup_classroom: venue.setup_classroom.toString(),
    setup_theater: venue.setup_theater.toString(),
    setup_reception: venue.setup_reception.toString(),
    photo: null as File | null,
    floor_plan: null as File | null,
  })

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault()

    // Build a real FormData
    const fd = new FormData()
    Object.entries(data).forEach(([key, val]) => {
      if (val !== null && val !== '') {
        // Append strings or files
        fd.append(key, val as any)
      }
    })
    // Spoof PUT
    fd.append('_method', 'PUT')

    // Inertia.post() sends a multipart POST
    Inertia.post(route('venues.update', venue.id), fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      preserveScroll: true,
    })
  }


  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Venues', href: '/venues' },
    { title: `Edit: ${venue.name}`, href: `/venues/${venue.id}/edit` },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Venue: ${venue.name}`} />

      <div className="w-8/12 p-4">
        <form onSubmit={handleUpdate} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <Alert>
              <CircleAlert className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc ml-5">
                  {Object.entries(errors).map(([field, msg]) => (
                    <li key={field} className="text-red-600">
                      {msg as string}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              
            />
          </div>

          {/* Current Photo Preview + Upload */}
          <div>
            <Label>Current Photo</Label>
            {venue.photo && (
              <img
                src={
                  venue.photo.startsWith('http')
                    ? venue.photo
                    : `/storage/${venue.photo}`
                }
                alt={`Photo of ${venue.name}`}
                className="h-16 w-auto object-cover rounded"
              />
            )}
            <Label htmlFor="photo" className="mt-3">
              Change Photo
            </Label>
            <Input id="photo" type="file" accept="image/*" placeholder="Enter venue photo" onChange={e => {
              if (e.target.files?.[0]) {
                setData('photo', e.target.files[0])
              }
            }} />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={e => setData('description', e.target.value)}
            />
          </div>

          {/* Dimensions */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="dimension_m">Dimension (m)</Label>
              <Input
                id="dimension_m"
                value={data.dimension_m}
                onChange={e => setData('dimension_m', e.target.value)}
                
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="dimension_f">Dimension (ft)</Label>
              <Input
                id="dimension_f"
                value={data.dimension_f}
                onChange={e => setData('dimension_f', e.target.value)}
                
              />
            </div>
          </div>

          {/* Setup counts */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['setup_banquet', 'Banquet'],
              ['setup_classroom', 'Classroom'],
              ['setup_theater', 'Theater'],
              ['setup_reception', 'Reception'],
            ].map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={key}>{`Setup ${label}`}</Label>
                <Input
                  id={key}
                  type="number"
                  min={0}
                  value={data[key as keyof typeof data] as string}
                  onChange={e =>
                    setData(key as any, e.target.value)
                  }
                  
                />
              </div>
            ))}
          </div>

          {/* Current Floor Plan Preview + Upload */}
          <div>
            <Label>Current Floor Plan</Label>
            {venue.floor_plan && (
              <img
                src={
                  venue.floor_plan.startsWith('http')
                    ? venue.floor_plan
                    : `/storage/${venue.floor_plan}`
                }
                alt={`Floor plan of ${venue.name}`}
                className="h-16 w-auto object-cover rounded"
              />
            )}
            <Label htmlFor="floor_plan" className="mt-3">
              Change Floor Plan
            </Label>
            <Input id="floor_plan" type="file" accept="image/*" placeholder="Enter floor plan" onChange={e => {
              if (e.target.files?.[0]) {
                setData('floor_plan', e.target.files[0])
              }
            }} />
          </div>

          <Button disabled={processing} type="submit">
            Update Venue
          </Button>
        </form>
      </div>
    </AppLayout>
  )
}
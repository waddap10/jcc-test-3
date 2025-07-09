// resources/js/Pages/Orders/Create.tsx

import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, useForm, usePage, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CircleAlert } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Orders',
    href: '/orders',
  },
  {
    title: 'Edit Order',
    href: '/orders/update',
  },
]



export default function Create() {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Order" />

      
    </AppLayout>
  )
}
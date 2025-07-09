// resources/js/Pages/Dashboard.tsx

import React from 'react'
import { Head, usePage, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import { type BreadcrumbItem } from '@/types'

type NearestEvent = {
  name: string
  started_at: string
  days_until: number
}

type Props = {
  month: number
  year: number
  eventsThisMonth: number
  eventsNextMonth: number
  loadCount: number
  showCount: number
  unloadCount: number
  nearestEvent: NearestEvent | null
}

export default function Dashboard() {
  const {
    eventsThisMonth,
    eventsNextMonth,
    nearestEvent,
  } = usePage<Props>().props

  const cards = [
     { title: 'Events This Month',      value: eventsThisMonth },
  { title: 'Events Next Month',      value: eventsNextMonth },
    {
      title: nearestEvent
        ? `Next: ${nearestEvent.name}`
        : 'No Upcoming Event',
      value: nearestEvent
        ? `${nearestEvent.days_until} days`
        : '-',
    },
  ]

  return (
    <AppLayout
      breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}
    >
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* ==== STAT CARDS ==== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map(({ title, value }) => (
            <div
              key={title}
              className="flex flex-col items-center justify-center rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-sm"
            >
              <h3 className="text-sm uppercase text-muted-foreground">
                {title}
              </h3>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* ==== REMAINING CONTENT ==== */}
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
          <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        </div>
      </div>
    </AppLayout>
  )
}
// resources/js/Pages/Beos/Show.tsx

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit3, Megaphone, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface Department {
    id: number;
    name: string;
}

interface Vendor {
    id: number;
    name: string;
    department?: Department;
}

interface Beo {
    id: number;
    description: string;
    vendor?: Vendor;
}

interface Order {
    id: number;
    event_name: string;
    beos?: Beo[];
}

interface PageProps {
    flash: { message?: string };
    order: Order;
    [key: string]: unknown;
}

export default function Show() {
    const { order, flash } = usePage<PageProps>().props;
    const assignments = order.beos ?? [];

    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (!confirm(`Delete assignment #${id}?`)) return;
        destroy(route('beos.destroy', [order.id, id]), {
            onSuccess: () => window.location.reload(),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Banquet Event Order', href: '/beos' },
        {
            title: `Assignments for ${order.event_name}`,
            href: `/beos/${order.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id} Assignments`} />

            {flash.message && (
                <div className="m-4">
                    <Alert>
                        <Megaphone className="h-4 w-4" />
                        <AlertTitle>Notice</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            <Link href={route('beos.create', { order: order.id })}>
  <Button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
    New Assignment
  </Button>
</Link>


            {assignments.length > 0 ? (
                <div className="m-4 overflow-auto">
                    <Table>
                        <TableCaption>Assignments for &ldquo;{order.event_name}&rdquo;</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Vendor Name</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell>{a.id}</TableCell>
                                    <TableCell>{a.vendor?.name ?? '—'}</TableCell>

                                    <TableCell>{a.vendor?.department?.name ?? '—'}</TableCell>
                                    <TableCell>{a.description}</TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Link href={route('beos.edit', [order.id, a.id])}>
                                            <Button size="sm" variant="outline" className="p-1" disabled={processing}>
                                                <Edit3 className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="p-1 text-red-600 hover:text-red-800"
                                            onClick={() => handleDelete(a.id)}
                                            disabled={processing}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="m-4 text-center text-gray-600">No assignments found for this order.</p>
            )}
        </AppLayout>
    );
}

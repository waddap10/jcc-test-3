import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Megaphone, X } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    organizer: string;
    address: string;
    contact_person: string;
    phone: string;
    email: string;
}

interface PageProps {
    flash: {
        message?: string;
    };

    customers: Customer[];
}

export default function Index() {
    const { customers, flash } = usePage().props as unknown as PageProps;

    const [showAlert, setShowAlert] = useState(true);

    const { processing, delete: destroy } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customers',
            href: '/customers',
        },
    ];

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete customer - ${id}. ${name}?`)) {
            destroy(route('customers.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            <div className="m-4 mb-4 inline-flex items-center">
                <Link href={route('customers.create')}>
                    <Button>Create Customer</Button>
                </Link>
            </div>
            <div>
                {flash.message && showAlert && (
                    <div className="fixed inset-x-0 top-4 flex justify-center px-4">
                        <Alert className="relative w-full cursor-pointer sm:w-3/4 md:w-2/3 lg:w-1/2" onClick={() => setShowAlert(false)}>
                            {/* Optional Close Button Instead of Whole-Box Click */}
                            <button
                                type="button"
                                className="absolute top-2 right-2 rounded p-1 hover:bg-gray-200"
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent the wrapper click
                                    setShowAlert(false);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <Megaphone className="h-4 w-4" />
                            <AlertTitle>Notification!!!!!!</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
            {customers.length > 0 ? (
                <div className="m-4">
                    <Table>
                        <TableCaption>List of all Customer</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Number</TableHead>
                                <TableHead>Organizer</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow>
                                    <TableCell className="font-medium">{customer.id}</TableCell>
                                    <TableCell>{customer.organizer}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell>{customer.contact_person}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell className="space-x-2 text-center">
                                        <Link href={route('customers.edit', customer.id)}>
                                            <Button className="bg-blue-500 hover:bg-blue-700">Edit</Button>
                                        </Link>
                                        <Button
                                            disabled={processing}
                                            onClick={() => handleDelete(customer.id, customer.organizer)}
                                            className="bg-red-500 hover:bg-red-700"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="px-4 py-10 text-center text-gray-500">No customer found.</div>
            )}
        </AppLayout>
    );
}

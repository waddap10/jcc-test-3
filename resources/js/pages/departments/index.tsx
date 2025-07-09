import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: '/departments',
    },
];

interface Department {
    id: number;
    name: string;
}

interface PageProps {
    flash: {
        message?: string
    },

    departments: Department[];
}

export default function Index() {
    const { departments, flash } = usePage().props as unknown as PageProps;

    const { processing, delete: destroy } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete department - ${id}. ${name}?`)) {
            destroy(route('departments.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Department" />
            <div className="m-4 mb-4 inline-flex items-center">
                <Link href={route('departments.create')} >
                    <Button>Create Department</Button>
                </Link>
            </div>
            <div>
                {flash.message && (
                    <Alert className='m-4'>
                        <Megaphone className='h-4 w-4' />
                        <AlertTitle>Notification!!!!!!</AlertTitle>
                        <AlertDescription>
                            {flash.message}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            {departments.length > 0 ? (
                <div className='m-4'>
                    <Table>
                        <TableCaption>List of all Department</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>

                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.map((department) => (
                                <TableRow>
                                    <TableCell className="font-medium">{department.id}</TableCell>
                                    <TableCell>{department.name}</TableCell>

                                    <TableCell className="text-center space-x-2">
                                        <Link href={route('departments.edit', department.id)}>
                                            <Button className='bg-blue-500 hover:bg-blue-700'>
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button disabled={processing} onClick={() => handleDelete(department.id, department.name)} className='bg-red-500 hover:bg-red-700'>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="px-4 py-10 text-center text-gray-500">
                    No department found.
                </div>
            )}
        </AppLayout>
    );
}

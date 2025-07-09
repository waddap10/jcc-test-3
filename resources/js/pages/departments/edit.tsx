import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CircleAlert } from 'lucide-react';

interface Department {
    id: number;
    name: string;
}

interface Props {
    department: Department;
}

export default function Edit({department}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: department.name,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('departments.update', department.id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Department', href: '/departments' },
    { title: `Edit: ${department.name}`, href: `/departments/${department.id}/edit` },
  ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Customers" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleUpdate} className='space-y-4'>
                    {/* Display errors if any */}
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <CircleAlert className='h-4 w-4' />
                            <AlertTitle>Error!!!!!!</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, value]) => (
                                        <li key={key} className="text-red-600">
                                            {value as string}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter customer name" value={data.name} onChange={e => setData('name', e.target.value)} />
                    </div>
                    <Button disabled={processing} type="submit" className="mt-4">Edit Department</Button>
                </form>
            </div>
        </AppLayout>
    );
}

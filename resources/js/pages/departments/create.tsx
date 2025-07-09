import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CircleAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] =
[
    { title: 'Departments', href: '/departments' },
    { title: 'Create', href: '/departments/create' },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        name: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('departments.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Department" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className='space-y-4'>
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
                        <Input id="name" placeholder="Enter department name" value={data.name} onChange={e => setData('name', e.target.value)} />
                    </div>
                    <Button disabled={processing} type="submit" className="mt-4">Create Department</Button>
                </form>
            </div>
        </AppLayout>
    );
}

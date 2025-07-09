import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CircleAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Customers',
        href: '/customers/create',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customers.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Customers" />
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
                        <Input id="name" placeholder="Enter customer name" value={data.name} onChange={e => setData('name', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Enter customer email" value={data.email} onChange={e => setData('email', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="Enter customer phone" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="address">Address</Label>
                        <Textarea id="address" placeholder="Enter customer address" value={data.address} onChange={e => setData('address', e.target.value)} />
                    </div>
                    <Button disabled={processing} type="submit" className="mt-4">Create Customer</Button>
                </form>
            </div>
        </AppLayout>
    );
}

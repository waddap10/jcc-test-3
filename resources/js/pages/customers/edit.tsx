import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CircleAlert } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Props {
    customer: Customer;
}

export default function Edit({customer}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('customers.update', customer.id));
    };

    return (
        <AppLayout breadcrumbs={[{title: 'Edit Customers', href: `/customers/${customer.id}/edit`,}]}>
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
                    <Button disabled={processing} type="submit" className="mt-4">Edit Customer</Button>
                </form>
            </div>
        </AppLayout>
    );
}

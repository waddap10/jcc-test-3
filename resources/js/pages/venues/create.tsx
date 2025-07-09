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
        title: 'Create Venues',
        href: '/venues/create',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        photo: null as File | null,
        description: '',
        dimension_m: '',
        dimension_f: '',
        setup_banquet: '',
        setup_classroom: '',
        setup_theater: '',
        setup_reception: '',
        floor_plan: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('venues.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Venues" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className='space-y-4' encType="multipart/form-data">
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
                        <Input id="name" placeholder="Enter venue name" value={data.name} onChange={e => setData('name', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="photo">Photo</Label>
                        <Input id="photo" type="file" accept="image/*" placeholder="Enter venue photo" onChange={e => {
                            if (e.target.files?.[0]) {
                                setData('photo', e.target.files[0])
                            }
                        }} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Enter venue description" value={data.description} onChange={e => setData('description', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="dimension_m">Dimension (m)</Label>
                        <Input id="dimension_m" placeholder="Enter dimension in meters" value={data.dimension_m} onChange={e => setData('dimension_m', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="dimension_f">Dimension (ft)</Label>
                        <Input id="dimension_f" placeholder="Enter dimension in feet" value={data.dimension_f} onChange={e => setData('dimension_f', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="setup_banquet">Setup Banquet</Label>
                        <Input id="setup_banquet" placeholder="Enter setup banquet" value={data.setup_banquet} onChange={e => setData('setup_banquet', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="setup_classroom">Setup Classroom</Label>
                        <Input id="setup_classroom" placeholder="Enter setup classroom" value={data.setup_classroom} onChange={e => setData('setup_classroom', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="setup_theater">Setup Theater</Label>
                        <Input id="setup_theater" placeholder="Enter setup theater" value={data.setup_theater} onChange={e => setData('setup_theater', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="setup_reception">Setup Reception</Label>
                        <Input id="setup_reception" placeholder="Enter setup reception" value={data.setup_reception} onChange={e => setData('setup_reception', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <Label className="mb-2" htmlFor="floor_plan">Floor Plan</Label>
                        <Input id="floor_plan" type="file" accept="image/*" placeholder="Enter floor plan" onChange={e => {
                            if (e.target.files?.[0]) {
                                setData('floor_plan', e.target.files[0])
                            }
                        }} />
                    </div>
                    <Button disabled={processing} type="submit" className="mt-4">Create Venue</Button>
                </form>
            </div>
        </AppLayout>
    );
}

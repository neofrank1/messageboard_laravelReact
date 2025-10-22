import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='grid grid-rows-1 grid-cols-2 gap-5 justify-center'>
                    <Card>
                        <CardContent>
                            Hello
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            Hello
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

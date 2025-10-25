import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { InputGroup, InputGroupText, InputGroupInput, InputGroupTextarea} from '@/components/ui/input-group';

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
                <div className='grid grid-rows-1 grid-cols-2 gap-4'>
                   <div>
                        <Card>
                            <CardContent>
                               <div className='grid grid-row gap-3'>
                                    <InputGroup label="Email" htmlFor="email">
                                        <InputGroupInput id="email" type="email" placeholder="Enter your email" />
                                    </InputGroup>
                               </div>
                            </CardContent>
                        </Card>
                   </div>
                   <div>
                        <Card>
                            <CardContent>
                                <InputGroup label="Username" htmlFor="username">
                                    <InputGroupInput id="username" type="text" placeholder="Enter your username" />
                                </InputGroup>
                                <InputGroup label="Bio" htmlFor="bio">
                                    <InputGroupTextarea id="bio" placeholder="Write a short bio" rows={4} />
                                </InputGroup>
                            </CardContent>
                        </Card>
                   </div>
                </div>
            </div>
        </AppLayout>
    );
}

import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const [message, setMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        // Here we simply alert the current message value
        alert(message);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className='grid grid-row w-full h-full'>
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className='flex flex-row gap-4 w-full'>
                        <div className='basis-64'>
                            <Card>
                                <CardContent>
                                    <div className='grid grid-row gap-3'>
                                        <div className=''>

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className='basis-254'>
                            <div>
                                <p className='font-bold text-2xl'>Post Activity</p>
                                <div className="grid grid-rows w-full gap-2">
                                    <Textarea
                                        placeholder="Type your message here."
                                        className="h-24 resize-none mt-2"
                                        value={message}
                                        onChange={handleChange}
                                    />
                                    <Button className='text-white hover:saturate-50' onClick={handleSend}>
                                        Send message
                                    </Button>
                                    <div>
                                        Post
                                    </div>
                                    <ScrollArea className='h-120 w-full'>
                                        <div className='mb-2'>
                                            <Card>
                                                <CardContent>
                                                    <p>
                                                        This is a sample post content.
                                                    </p>
                                                </CardContent>
                                            </Card>
                                            <Separator className='mt-4' />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                        <div className='basis-128'>
                            <div className='grid grid-rows gap-4'>
                                <Card>
                                    <CardContent>

                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent>

                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

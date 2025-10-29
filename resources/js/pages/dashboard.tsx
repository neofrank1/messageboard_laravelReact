import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
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
    const form = useForm({ content: '' });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post('/postMessage', {
            onSuccess: () => form.reset('content'),
        });
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
                                    <form onSubmit={submit}>
                                        <Textarea
                                            placeholder="Type your message here."
                                            className="h-24 resize-none mt-2"
                                            value={form.data.content}
                                            onChange={e => form.setData('content', e.target.value)}
                                        />
                                        <Button className='text-white hover:saturate-50 mt-2 w-full' type="submit" disabled={form.processing || !form.data.content.trim()}>
                                            {form.processing ? 'Sending...' : 'Send message'}
                                        </Button>
                                    </form>
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

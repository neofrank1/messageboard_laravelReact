import { Card, CardContent } from '@/components/ui/card';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Message} from '@/types/messageTypes';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Dashboard({ messages }: { messages: Message[] }) {
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm({ content: '' });
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post('/postMessage', {
            onSuccess: () => form.reset('content'),
        });
    };

    const [likes, setLikes] = useState<{ [key: number]: number }>({});
    const [dislikes, setDislikes] = useState<{ [key: number]: number }>({});

    const handleLike = (messageId: number) => {
        setLikes((prevLikes) => ({
            ...prevLikes,
            [messageId]: (prevLikes[messageId] || 0) + 1,
        }));
        router.post(`/likeMessage/${messageId}`, { preserveScroll: true });
    };

    const handleDislike = (messageId: number) => {
        setDislikes((prevDislikes) => ({
            ...prevDislikes,
            [messageId]: (prevDislikes[messageId] || 0) + 1,
        }));
        router.post(`/dislikeMessage/${messageId}`, { preserveScroll: true });
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [messages]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    };

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => {
            const aTime = new Date(a.created_at).getTime();
            const bTime = new Date(b.created_at).getTime();
            return bTime - aTime; // newest first
        });
    }, [messages]);

    return (
        <AppLayout>
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
                                        <p className='font-bold text-2xl'>Post</p>
                                        <Separator className='my-2' />
                                    </div>
                                    <ScrollArea className='h-150 w-full'>
                                        {isLoading ? (
                                            Array.from({ length: 3 }).map((_, i) => (
                                                <Fragment key={`skeleton-${i}`}>
                                                    <div className='grid grid-rows-2 grid-flow-col-dense mb-2'>
                                                        <div className='row-span-2'>
                                                            <div className='grid grid-rows-2 grid-cols-1'>
                                                                <div className='row-span-1'>
                                                                    <Skeleton className='h-4 w-24' />
                                                                    <div className='grid justify-items-center'>
                                                                        <Skeleton className='my-2 mx-2 w-[50px] h-[50px] rounded-full' />
                                                                    </div>
                                                                </div>
                                                                <div className='row-span-1 grid grid-rows-2 gap-1'>
                                                                    <div className='flex items-center gap-1'>
                                                                        <Skeleton className='w-[2rem] h-[2rem] rounded-md' />
                                                                        <Skeleton className='h-4 w-6' />
                                                                    </div>
                                                                    <div className='flex items-center gap-1'>
                                                                        <Skeleton className='w-[2rem] h-[2rem] rounded-md' />
                                                                        <Skeleton className='h-4 w-6' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-span-20 row-span-2'>
                                                            <Card className='h-[150px] mb-2 w-full'>
                                                                <CardContent>
                                                                    <Skeleton className='h-4 w-3/4 mb-2' />
                                                                    <Skeleton className='h-4 w-5/6 mb-2' />
                                                                    <Skeleton className='h-4 w-2/3' />
                                                                </CardContent>
                                                            </Card>
                                                            <Skeleton className='ml-auto h-3 w-32' />
                                                        </div>
                                                    </div>
                                                    {i < 2 && <Separator className='mb-4 col-span-20' />}
                                                </Fragment>
                                            ))
                                        ) : (
                                            sortedMessages.map((message, i) => (
                                                <Fragment key={message.id}>
                                                    <div className='grid grid-rows-2 grid-flow-col-dense mb-2'>
                                                        <div className='row-span-2'>
                                                            <div className='grid grid-rows-2 grid-cols-1'>
                                                                <div className='row-span-1'>
                                                                    <p className='text-left font-extrabold'>{message.user_name}</p>
                                                                    <div className='grid justify-items-center'>
                                                                        <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" className='my-2 mx-2 w-[50px] h-[50px] rounded-full' />
                                                                    </div>
                                                                </div>
                                                                <div className='row-span-1 grid grid-rows-2 gap-1'>
                                                                    <div className='flex items-center gap-1'>
                                                                        <Button className='w-[2rem] h-[2rem]' type='button' onClick={() => handleLike(message.id)}>
                                                                            <ThumbsUpIcon className='w-[1rem] h-[1rem]' />
                                                                        </Button>
                                                                        <span className='my-0.5'>{message.likes}</span>
                                                                    </div>
                                                                    <div className='flex items-center gap-1'>
                                                                        <Button className='w-[2rem] h-[2rem]' type='button' onClick={() => handleDislike(message.id)}>
                                                                            <ThumbsDownIcon className='w-[1rem] h-[1rem]' />
                                                                        </Button>
                                                                        <span className='my-0.5'>{message.dislikes}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-span-20 row-span-2'>
                                                            <Card className='h-[150px] mb-2 w-full'>
                                                                <CardContent>
                                                                    <p >{message.content}</p>
                                                                </CardContent>
                                                            </Card>
                                                            <p className='text-right text-sm text-gray-500'>{formatDate(message.created_at)}</p>
                                                        </div>
                                                    </div>
                                                    {i < sortedMessages.length - 1 && <Separator className='mb-4 col-span-20' />}
                                                </Fragment>
                                            ))
                                        )}
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

import { Card, CardContent, CardTitle} from '@/components/ui/card';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Message} from '@/types/messageTypes';
import { type FriendListTypes} from '@/types/friendTypes';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { type SharedData } from '@/types';

export default function Dashboard({ messages, friends }: { messages: Message[], friends: FriendListTypes[] }) {
    const [isLoading, setIsLoading] = useState(true);
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const form = useForm({ content: '' });
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post('/postMessage', {
            onSuccess: () => form.reset('content'),
        });
    };

    const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set());
    const [dislikedMessages, setDislikedMessages] = useState<Set<number>>(new Set());

    const handleLike = (messageId: number) => {
        const isLiked = likedMessages.has(messageId);
        const isDisliked = dislikedMessages.has(messageId);
        
        if (isLiked) {
            // Remove like
            setLikedMessages(prev => {
                const newSet = new Set(prev);
                newSet.delete(messageId);
                return newSet;
            });
            router.post(`/likeMessage/${messageId}`, { action: 'remove' }, { preserveScroll: true });
        } else {
            // Add like
            setLikedMessages(prev => new Set(prev).add(messageId));
            
            // If disliked, remove dislike first
            if (isDisliked) {
                setDislikedMessages(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(messageId);
                    return newSet;
                });
                router.post(`/dislikeMessage/${messageId}`, { action: 'remove' }, { preserveScroll: true });
            }
            
            router.post(`/likeMessage/${messageId}`, { action: 'add' }, { preserveScroll: true });
        }
    };

    const handleDislike = (messageId: number) => {
        const isDisliked = dislikedMessages.has(messageId);
        const isLiked = likedMessages.has(messageId);
        
        if (isDisliked) {
            // Remove dislike
            setDislikedMessages(prev => {
                const newSet = new Set(prev);
                newSet.delete(messageId);
                return newSet;
            });
            router.post(`/dislikeMessage/${messageId}`, { action: 'remove' }, { preserveScroll: true });
        } else {
            // Add dislike
            setDislikedMessages(prev => new Set(prev).add(messageId));
            
            // If liked, remove like first
            if (isLiked) {
                setLikedMessages(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(messageId);
                    return newSet;
                });
                router.post(`/likeMessage/${messageId}`, { action: 'remove' }, { preserveScroll: true });
            }
            
            router.post(`/dislikeMessage/${messageId}`, { action: 'add' }, { preserveScroll: true });
        }
    }

    const profileRedirect = (users_id: number) => {
        router.get(`/profile?id=${encodeURIComponent(users_id)}`)
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [messages, friends, auth]);

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
                                            ADS
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
                                                                        <Button 
                                                                            className={`w-[2rem] h-[2rem] ${likedMessages.has(message.id) ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`} 
                                                                            type='button' 
                                                                            onClick={() => handleLike(message.id)}
                                                                            variant={likedMessages.has(message.id) ? 'default' : 'outline'}
                                                                        >
                                                                            <ThumbsUpIcon className='w-[1rem] h-[1rem]' />
                                                                        </Button>
                                                                        <span className='my-0.5'>{message.likes}</span>
                                                                    </div>
                                                                    <div className='flex items-center gap-1'>
                                                                        <Button 
                                                                            className={`w-[2rem] h-[2rem] ${dislikedMessages.has(message.id) ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`} 
                                                                            type='button' 
                                                                            onClick={() => handleDislike(message.id)}
                                                                            variant={dislikedMessages.has(message.id) ? 'default' : 'outline'}
                                                                        >
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
                                {/* Profile Card */}
                                <Card>
                                    <CardContent>
                                        {isLoading ? (
                                            <div className='grid grid-rows'>
                                                <div className='flex justify-start items-center'>
                                                    <Skeleton className='w-[50px] h-[50px] rounded-full' />
                                                    <div className='grid grid-rows-2 gap-2 ml-2 py-1'>
                                                        <Skeleton className='h-4 w-58' />
                                                        <Skeleton className='h-4 w-58' />
                                                    </div>
                                                </div>
                                                <Separator className='my-2'/>
                                                <div className='grid grid-cols-3 gap-2 mt-3'>
                                                    <div className='grid grid-rows-2 text-center'>
                                                        <p className='text-sm text-gray-500'>Posts</p>
                                                        <Skeleton className='h-4 w-24' />
                                                    </div>
                                                    <div className='grid grid-rows-2 text-center'>
                                                        <p className='text-sm text-gray-500'>Friends</p>
                                                        <Skeleton className='h-4 w-24' />
                                                    </div>
                                                    <div className='grid grid-rows-2 text-center'>
                                                        <p className='text-sm text-gray-500'>Likes</p>
                                                        <Skeleton className='h-4 w-24' />
                                                    </div>
                                                </div>
                                               
                                            </div>
                                        ) : (
                                        <div className='grid grid-rows'>
                                            <div className='flex justify-start items-center'>
                                                <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" className="w-[50px] h-[50px] rounded-full" />
                                                <div className='grid grid-rows-2 ml-2 py-1'>
                                                    <p
                                                        className='font-extrabold cursor-pointer'
                                                        onClick={() => profileRedirect(auth.user.id)}
                                                    >
                                                        {auth.user.name}
                                                    </p>
                                                    <p className='text-sm text-gray-500'>{auth.user.email}</p>
                                                </div>
                                            </div>
                                            <Separator className='my-2'/>
                                            <div className='grid grid-cols-3 gap-2 mt-3'>
                                                <div className='grid grid-rows-2 text-center'>
                                                    <p className='text-sm text-gray-500'>Posts</p>
                                                    <p className='text-sm text-gray-500'>10</p>
                                                </div>
                                                <div className='grid grid-rows-2 text-center'>
                                                    <p className='text-sm text-gray-500'>Friends</p>
                                                    <p className='text-sm text-gray-500'>10</p>
                                                </div>
                                                <div className='grid grid-rows-2 text-center'>
                                                    <p className='text-sm text-gray-500'>Likes</p>
                                                    <p className='text-sm text-gray-500'>50</p>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </CardContent>
                                </Card>
                                {/* Friend Side Card */}
                                <Card>
                                    <CardContent>
                                        <CardTitle className='font-bold text-lg text-left'>
                                            Friends
                                        </CardTitle>
                                        <Separator className='my-1'/>
                                        {isLoading ? (
                                            Array.from({ length: 3 }).map((_, i) => (
                                                <Fragment key={`skeleton-${i}`}>
                                                     <div className='border-b border-0.5 grid-cols-2'>
                                                        <div className='flex justify-start items-center'>
                                                            <Skeleton className='w-[35px] h-[35px] rounded-full' />
                                                            <div className='grid grid-rows-2 gap-2 ml-2 py-1'>
                                                                <Skeleton className='h-4 w-58' />
                                                                <Skeleton className='h-4 w-58' />
                                                            </div>
                                                        </div>
                                                     </div>
                                                </Fragment>
                                            ))
                                        ) : (
                                        <div className='grid grid-rows'>
                                            {friends.map((friend) => (
                                            <div key={friend.friend_id} className='border-b border-0.5 grid-cols'>
                                                <div className='flex justify-start items-center'>
                                                    <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" className="w-[35px] h-[35px] rounded-full" />
                                                    <div className='grid grid-rows-2 ml-2 py-1'>
                                                        <p className='font-extrabold cursor-pointer' onClick={() => profileRedirect(friend.friend_id)}>{friend.friend_name}</p>
                                                        <p className='text-sm text-gray-500'>{friend.friend_email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            ))}
                                        </div>
                                        )}
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
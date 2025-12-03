import AppLayout from '@/layouts/app-layout';
import { Head } from "@inertiajs/react";
import { Card, CardContent } from '@/components/ui/card';
import { usePage, router } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type UserProfileTypes} from '@/types/userTypes';
import { type Message } from '@/types/messageTypes';
import { useMemo, Fragment, useState } from 'react';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

export default function ProfilePage({messages, user, postCount, friendCount}: {messages: Message, user: UserProfileTypes, postCount: number, friendCount: number}) {
    const { auth } = usePage<SharedData>().props;
    if (!auth.user) {
        return <div>User not found</div>;
    }

     const formatDate = (date: string) => {
        return new Date(date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
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

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => {
            const aTime = new Date(a.created_at).getTime();
            const bTime = new Date(b.created_at).getTime();
            return bTime - aTime; // newest first
        });
    }, [messages]);

    return (
        <AppLayout>
            <Head title="Profile" />
            <div className="w-full h-full p-4 grid grid-rows">
                <div className='grid grid-cols-3 grid-rows-3 gap-4 h-120'>
                    <Card className='col-span-3 row-span-1'>
                        <CardContent>
                            <div className='grid grid-rows'>
                                <div className='grid grid-cols-2'>
                                    <div className="flex items-center justify-start gap-2">
                                        <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" className="w-[90px] h-[90px] rounded-full" />
                                        <div className="grid grid-rows-2 ml-1 content-center mt-4">
                                            <p className="font-extrabold text-3xl">{user.name}</p>
                                            <p className="text-lg text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-end'>
                                        <Button>Edit Profile</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className='col-span-1 row-span-2'>
                        <Card>
                            <CardContent>
                            <div className='grid grid-cols-3 gap-2 mt-3'>
                                <div className='grid grid-rows-2 text-center'>
                                    <p className='text-sm text-gray-500'>Posts</p>
                                    <p className='text-sm text-gray-500'>{postCount}</p>
                                </div>
                                <div className='grid grid-rows-2 text-center'>
                                    <p className='text-sm text-gray-500'>Friends</p>
                                    <p className='text-sm text-gray-500'>{friendCount}</p>
                                </div>
                                <div className='grid grid-rows-2 text-center'>
                                    <p className='text-sm text-gray-500'>Likes</p>
                                    <p className='text-sm text-gray-500'>50</p>
                                </div>
                            </div>
                            <Separator className='my-2'/>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='col-span-2'>
                        {sortedMessages.map((message, i) => (
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
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>     
    )
}
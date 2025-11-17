import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { searchUserTypes } from "@/types/friendTypes";
import { useState } from "react";
import { UserRoundCheck, UserRoundPlus } from 'lucide-react';

export default function SearchFriendPage({ users, addedFriendIds = [], friendIds = [] }: { users: searchUserTypes[], addedFriendIds?: number[], friendIds?: number[] }) {

    const [addedFriends, setAddedFriends] = useState<Set<number>>(new Set(addedFriendIds));
    const [friends] = useState<Set<number>>(new Set(friendIds));

    const handleAddFriend = (userId: number) => {
        router.post('/addFriend', { friend_id: userId }, {
            onSuccess: (response) => {
                console.log('Friend request sent successfully!', response);
                // Add the user ID to the set of added friends
                setAddedFriends(prev => new Set(prev).add(userId));
            },
            onError: (errors) => {
                console.error('Error sending friend request:', errors);
            }
        });
    }

    return (
        <AppLayout>
           <Head title="Friend Requests" />
            <div className="w-full h-full p-4 grid grid-rows">
                <Card>
                    <CardContent>
                        <div className="grid grid-rows gap-4">
                            <div className="text-2xl font-extrabold">
                                Friend Requests
                            </div>
                            <Separator />
                            {users.length === 0 ? (
                                <div className="text-center text-gray-500">
                                    No Users Found
                                </div>
                            ) : (
                                <div className="grid grid-rows">
                                    {users.map((request) => (
                                        <div key={request.id} className="border-b-1 p-2 border-gray-400">
                                            <div className="grid grid-cols-2">
                                                <input type="hidden" value={request.id} />  
                                                <div className="flex justify-start items-center">
                                                    <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" className="w-[50px] h-[50px] rounded-full" />
                                                    <div className="ml-3 grid grid-rows">
                                                        <p className="text-lg font-extrabold">{request.name}</p>
                                                        <p className="text-sm text-gray-500">{request.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center gap-4">
                                                    <button 
                                                        className={`border-2 rounded-sm p-1 flex items-center gap-2 cursor-pointer ${
                                                            friends.has(request.id)
                                                                ? 'border-green-500 bg-green-600 text-white opacity-75 cursor-not-allowed'
                                                                : addedFriends.has(request.id)
                                                                ? 'border-green-500 bg-green-600 text-white opacity-75 cursor-not-allowed'
                                                                : 'border-gray-200 hover:bg-gray-700 bg-emerald-700'
                                                        }`}
                                                        type='button'
                                                        onClick={() => handleAddFriend(request.id)}
                                                        disabled={friends.has(request.id) || addedFriends.has(request.id)}
                                                    >
                                                        {friends.has(request.id) ? <UserRoundCheck /> : addedFriends.has(request.id) ? <UserRoundPlus /> : <UserRoundPlus />}
                                                        {friends.has(request.id) ? 'Friends' : addedFriends.has(request.id) ? 'Friend Added' : 'Add Friend'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
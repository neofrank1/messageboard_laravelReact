import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserRoundX, UserRoundCheck } from 'lucide-react';
import { FriendRequestTypes } from "@/types/friendRequestTypes";


export default function FriendRequestPage({ friendRequests }: { friendRequests: FriendRequestTypes[] }) {
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
                            {friendRequests.length === 0 ? (
                                <div className="text-center text-gray-500">
                                    No Friend Requests
                                </div>
                            ) : (
                                <div className="grid grid-rows">
                                    {friendRequests.map((request, i) => (
                                        <div key={request.id} className="border-b-1 p-2 border-gray-400">
                                            <div className="grid grid-cols-2">
                                                <input type="hidden" value={request.user_id} />
                                                <div className="flex justify-start items-center">
                                                    <img src="https://i.pravatar.cc/150?img=1" alt="User Avatar" className="w-[50px] h-[50px] rounded-full" />
                                                    <div className="ml-3 grid grid-rows">
                                                        <p className="text-lg font-extrabold">{request.user_name}</p>
                                                        <p className="text-sm text-gray-500">{request.user_email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center gap-4">
                                                    <button className="border-2 rounded-sm p-1 border-gray-200 hover:bg-gray-700 bg-emerald-700 flex items-center gap-2 cursor-pointer" type="button">
                                                        <UserRoundCheck />Accept
                                                    </button>
                                                    <button className="border-2 rounded-sm p-1 border-gray-200 hover:bg-gray-700 bg-red-800 flex items-center gap-2 cursor-pointer" type="button">
                                                        <UserRoundX /> Reject
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

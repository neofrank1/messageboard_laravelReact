<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FriendList;
use App\Models\FriendRequest;

use function Termwind\render;

class FriendListController extends Controller
{
    //

    public function friendRequestPage() {
        return inertia('friend/friend_request');
    }


    public function addFriend(Request $request) {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);
        $friendRequest = new FriendRequest();
        $friendRequest->user_id = $request->user()->id;
        $friendRequest->friend_id = $request->input('friend_id');
        $friendRequest->status = false;
        $friendRequest->save();
        return redirect()->back()->with('success', 'Friend request sent successfully!');
    }

    public function acceptFriendRequest(Request $request) {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);
        $friendRequest = FriendRequest::where('user_id', $request->user()->id)->where('friend_id', $request->input('friend_id'))->first();
        $friendRequest->status = true;
        $friendRequest->save();
    }

    public function removeFriend(Request $request) {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);
        $friendList = FriendList::where('user_id', $request->user()->id)->where('friend_id', $request->input('friend_id'))->first();
        $friendList->delete();
        return redirect()->back()->with('success', 'Friend removed successfully!');
    }
}
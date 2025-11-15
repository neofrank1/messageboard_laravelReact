<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FriendList;
use App\Models\FriendRequest;
use Illuminate\Support\Facades\DB;
class FriendListController extends Controller
{
    //

    public function friendRequestPage() {
        
        if (auth()->check() == false) {
            return redirect()->route('login');
        } else {
            $user = auth()->user();
        }

        $friendRequest = DB::table('friend_requests')
                        ->leftJoin('users', 'friend_requests.user_id', '=', 'users.id')
                        ->select('friend_requests.*', 'users.name as user_name', 'users.id as user_id')
                        ->where('friend_requests.user_id', $user->id)
                        ->where('friend_requests.status', false)
                        ->get();

        return inertia('friend/friend_request',['friendRequests' => $friendRequest]);
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

    public function searchUser(Request $request) {
        $request->validate([
            'search' => 'required|string|max:255',
        ]);
        $searchQuery = $request->query('search');
        $users = DB::table('users')
                ->where('name', 'like', '%' . $searchQuery . '%')
                ->get();
        return inertia('friend/search_friend', ['users' => $users]);
    }
}
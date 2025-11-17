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
                        ->select('friend_requests.*', 'users.name as user_name', 'users.id as user_id', 'users.email as user_email')
                        ->where('friend_requests.friend_id', $user->id)
                        ->where('friend_requests.status', false)
                        ->get();

        return inertia('friend/friend_request',['friendRequests' => $friendRequest]);
    }

    // Accept a friend request
    public function acceptFriendRequest(Request $request) {
        $request->validate([
            'request_id' => 'required|exists:friend_requests,id',
        ]);
        $friendRequest = FriendRequest::where('id', $request->input('request_id'))->first();
        $friendRequest->status = true;
        if ($friendRequest->save()) {
            // Save bidirectional friendship
            // For the one who is accepting the friend request
            $friendList1 = new FriendList();
            $friendList1->user_id = $request->user()->id;
            $friendList1->friend_id = $friendRequest->user_id;
            $friendList1->save();

            // For the one who is being accepted as a friend
            $friendList2 = new FriendList();
            $friendList2->user_id = $friendRequest->user_id;
            $friendList2->friend_id = $request->user()->id;
            $friendList2->save();

            return redirect()->back()->with('success', 'Friend request accepted successfully!');
        } else {
            return redirect()->back()->with('error', 'Failed to accept friend request!');
        }
    }

    // Reject a friend request
    public function rejectFriendRequest(Request $request) {
        $request->validate([
            'request_id' => 'required|exists:friend_requests,id',
        ]);
        $friendRequest = FriendRequest::where('id', $request->input('request_id'))->first();
        if ($friendRequest->delete()) {
            return redirect()->back()->with('success', 'Friend request rejected successfully!');
        } else {
            return redirect()->back()->with('error', 'Failed to reject friend request!');
        }
    }

    // Add a friend
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

    // Remove a friend
    public function removeFriend(Request $request) {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);
        $friendList = FriendList::where('user_id', $request->user()->id)->where('friend_id', $request->input('friend_id'))->first();
        $friendList->delete();
        return redirect()->back()->with('success', 'Friend removed successfully!');
    }

    // Search for users to add as friends
    public function searchUser(Request $request) {
        $request->validate([
            'search' => 'required|string|max:255',
        ]);
        $searchQuery = $request->query('search');
        $users = DB::table('users')
                ->where('name', 'like', '%' . $searchQuery . '%')
                ->where('id', '!=', $request->user()->id)
                ->get();
        
        // Get the IDs of users the current user has already sent friend requests to
        $addedFriendIds = DB::table('friend_requests')
                ->where('user_id', $request->user()->id)
                ->pluck('friend_id')
                ->toArray();
        
        // Get the IDs of users who are already friends with the current user
        $friendIds = DB::table('friend_lists')
                ->where('user_id', $request->user()->id)
                ->pluck('friend_id')
                ->toArray();
        
        return inertia('friend/search_friend', [
            'users' => $users,
            'addedFriendIds' => $addedFriendIds,
            'friendIds' => $friendIds
        ]);
    }
}

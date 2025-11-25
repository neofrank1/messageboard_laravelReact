<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function chatPage() {

        $friends = DB::table('friend_lists')
                    ->join('users', 'friend_lists.friend_id', '=', 'users.id')
                    ->select('users.id as friend_id', 'users.name as friend_name', 'users.email as friend_email')
                    ->where('friend_lists.user_id', auth()->user()->id)
                    ->get();

        $friendsArray = [];
        
        foreach ($friends as $friend) {
            $friendsArray[] = [
                'id' => $friend->friend_id,
                'value' => $friend->friend_name,
            ];
        }
        
        return inertia('message/chat', ['Friends' => $friendsArray]);
    }

    public function sendMessage(Request $request) {
        // Logic to send message
    }
}
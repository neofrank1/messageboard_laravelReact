<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    // No constructor needed; allow the framework to instantiate this controller.

    public function index() {
        // Get all friends of the current user
        $friendIds = DB::table('friend_lists')
                    ->where('user_id', auth()->user()->id)
                    ->pluck('friend_id')
                    ->toArray();
        
        // Add the current user's ID to the array
        $friendIds[] = auth()->user()->id;

        // Get messages from the current user and their friends
        $messages = DB::table('messages')
                    ->join('users', 'messages.user_id', '=', 'users.id')
                    ->select('messages.*', 'users.name as user_name')
                    ->whereIn('messages.user_id', $friendIds)
                    ->get();

        $friends = DB::table('friend_lists')
                    ->join('users', 'friend_lists.friend_id', '=', 'users.id')
                    ->select('users.id as friend_id', 'users.name as friend_name', 'users.email as friend_email')
                    ->where('friend_lists.user_id', auth()->user()->id)
                    ->get();

        return inertia('dashboard', ['messages' => $messages, 'friends' => $friends]);
    }

    public function postMessage(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);
        $message = new Message();
        $message->user_id = $request->user()->id;
        $message->content = $request->input('content');
        $message->likes = 0;
        $message->dislikes = 0;
        $message->save();

        return redirect()->back()->with('success', 'Message posted successfully!');
    }

    public function likeMessage($id)
    {
        $message = Message::findOrFail($id);
        $action = request()->input('action', 'add'); // 'add' or 'remove'
        
        if ($action === 'remove') {
            $message->likes = max(0, $message->likes - 1);
        } else {
            $message->likes += 1;
        }
        $message->save();

        return redirect()->back();
    }

    public function dislikeMessage($id)
    {
        $message = Message::findOrFail($id);
        $action = request()->input('action', 'add'); // 'add' or 'remove'
        
        if ($action === 'remove') {
            $message->dislikes = max(0, $message->dislikes - 1);
        } else {
            $message->dislikes += 1;
        }
        $message->save();

        return redirect()->back();
    }

}
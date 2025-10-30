<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    // No constructor needed; allow the framework to instantiate this controller.

    public function index() {
        $messages = DB::table('messages')
                    ->join('users', 'messages.user_id', '=', 'users.id')
                    ->select('messages.*', 'users.name as user_name')
                    ->get();
        return inertia('dashboard', ['messages' => $messages]);
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
        $message->likes += 1;
        $message->save();

        return redirect()->back();
    }
}

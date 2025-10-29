<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // No constructor needed; allow the framework to instantiate this controller.

    public function postMessage(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);
        $message = new \App\Models\Message();
        $message->user_id = $request->user()->id;
        $message->content = $request->input('content');
        $message->likes = 0;
        $message->dislikes = 0;
        $message->save();

        return redirect()->back()->with('success', 'Message posted successfully!');
    }
}

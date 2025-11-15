<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function chatPage() {
        return inertia('message/chat');
    }

    public function sendMessage(Request $request) {
        // Logic to send message
    }
}
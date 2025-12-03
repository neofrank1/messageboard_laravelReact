<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\ChatMessage;

class ChatController extends Controller
{
    public function chatPage() {

        $friends = DB::table('friend_lists')
                    ->join('users', 'friend_lists.friend_id', '=', 'users.id')
                    ->select('users.id as friend_id', 'users.name as friend_name', 'users.email as friend_email')
                    ->where('friend_lists.user_id', auth()->user()->id)
                    ->get();

        $friendsArray = [];

        $userId = auth()->user()->id;
        
        // Get friend IDs
        $friendIds = DB::table('friend_lists')
                    ->where('user_id', $userId)
                    ->pluck('friend_id')
                    ->toArray();
        
        // Only show chats with friends
        if (empty($friendIds)) {
            $chat = collect([]);
        } else {
            $chat = Chat::where(function($query) use ($userId, $friendIds) {
                            $query->where('user_id', $userId)
                                  ->whereIn('receiver_id', $friendIds);
                        })
                        ->orWhere(function($query) use ($userId, $friendIds) {
                            $query->where('receiver_id', $userId)
                                  ->whereIn('user_id', $friendIds);
                        })
                        ->join('users', 'chats.user_id', '=', 'users.id')
                        ->join('users as receiver', 'chats.receiver_id', '=', 'receiver.id')
                        ->select('chats.*', 'users.name as user_name', 'receiver.name as receiver_name')
                        ->get();
        }
        
        foreach ($friends as $friend) {
            $friendsArray[] = [
                'id' => $friend->friend_id,
                'value' => $friend->friend_name,
            ];
        }
        
        return inertia('message/chat', ['Friends' => $friendsArray, 'chat' => $chat]);
    }

    public function sendMessage(Request $request) {
        $request->validate([
            'message' => 'required|string|max:1000',
            'chat_id' => 'required|exists:chats,id',
        ]);

        $userId = auth()->user()->id;
        $chatId = $request->input('chat_id');

        // Verify the user is part of this chat
        $chat = Chat::find($chatId);
        if (!$chat || ($chat->user_id !== $userId && $chat->receiver_id !== $userId)) {
            return back()->withErrors(['error' => 'Unauthorized access to this chat']);
        }

        // Create the message
        $message = ChatMessage::create([
            'chat_id' => $chatId,
            'user_id' => $userId,
            'message' => $request->input('message'),
        ]);

        // Update chat's updated_at timestamp
        $chat->touch();

        return back();
    }

    public function getChatMessages(Request $request) {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
        ]);

        $receiverId = $request->query('receiver_id');
        $userId = auth()->user()->id;

        if ($userId === $receiverId) {
            return response()->json([
                'error' => 'You cannot send messages to yourself',
            ], 400);
        }

        // Find existing chat between the two users (either direction)
        $chat = Chat::where(function($query) use ($userId, $receiverId) {
                    $query->where('user_id', $userId)
                          ->where('receiver_id', $receiverId);  
                })
                ->orWhere(function($query) use ($userId, $receiverId) {
                    $query->where('user_id', $receiverId)
                          ->where('receiver_id', $userId);
                })
                ->join('users', 'chats.user_id', '=', 'users.id')
                ->join('users as receiver', 'chats.receiver_id', '=', 'receiver.id')
                ->select('chats.*', 'users.name as user_name', 'receiver.name as receiver_name')
                ->first();

        // If no chat exists, create one
        if (!$chat) {
            $newChat = Chat::create([
                'user_id' => $userId,
                'receiver_id' => $receiverId,
            ]);
            
            // Load chat with user names
            $chat = Chat::where('id', $newChat->id)
                ->join('users', 'chats.user_id', '=', 'users.id')
                ->join('users as receiver', 'chats.receiver_id', '=', 'receiver.id')
                ->select('chats.*', 'users.name as user_name', 'receiver.name as receiver_name')
                ->first();
        }

        // Get all messages for this chat
        $messages = ChatMessage::where('chat_id', $chat->id)
                    ->orderBy('created_at', 'asc')
                    ->get();

        // Return JSON response with chat container and messages
        return response()->json([
            'chat' => $chat,
            'messages' => $messages
        ]);
    }
}
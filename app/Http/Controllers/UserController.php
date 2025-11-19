<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    //
    public function profilePage(Request $request) {
        $userId = $request->query('id');

        $user = User::find($userId);
        if (!$user) {
            return redirect()->back()->with('error', 'User not found!');
        }

        // Fetch additional user info if needed
        $friendCount = DB::table('friend_lists')
                        ->where('user_id', $userId)
                        ->count();
        
        // Fetch all messages sent by the user
        $posts = DB::table('messages')
                        ->where('user_id', $userId)
                        ->get();

        $postCount = DB::table('messages')
                        ->where('user_id', $userId)
                        ->count();

        return inertia('user/profile', [
            'user' => $user,
            'friendCount' => $friendCount,
            'messages' => $posts,
            'postCount' => $postCount,
        ]);
    }
}

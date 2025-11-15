<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\FriendListController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Message routes
    Route::get('/dashboard', [MessageController::class, 'index'])->name('dashboard');
    Route::post('/postMessage', [MessageController::class, 'postMessage'])->name('postMessage');
    Route::post('/likeMessage/{id}', [MessageController::class, 'likeMessage'])->name('likeMessage');
    Route::post('/dislikeMessage/{id}', [MessageController::class, 'dislikeMessage'])->name('dislikeMessage');

    // Chat page route
    Route::get('/chat', [ChatController::class, 'chatPage'])->name('chatPage');
    Route::post('/sendMessage', [ChatController::class, 'sendMessage'])->name('sendMessage');

    // Friend Functionality route
    Route::post('/addFriend', [FriendListController::class, 'addFriend'])->name('addFriend');
    Route::post('/acceptFriendRequest', [FriendListController::class, 'acceptFriendRequest'])->name('acceptFriendRequest');
    Route::post('/removeFriend', [FriendListController::class, 'removeFriend'])->name('removeFriend');
    Route::get('/friendRequests', [FriendListController::class, 'friendRequestPage'])->name('friendRequestPage');
    Route::match(['get', 'post'], '/searchUser', [FriendListController::class, 'searchUser'])->name('searchUser');
});

require __DIR__.'/settings.php';

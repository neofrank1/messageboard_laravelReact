import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head } from '@inertiajs/react';

export default function ChatPage() {
  return (
    <AppLayout>
        <Head title="Chat" />
            <div>Chat Page</div>
    </AppLayout>
  );
}
import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';

export default function ChatPage() {
  return (
    <AppLayout>
        <Head title="Chat" />
            <div className='w-full h-full p-4 grid grid-rows'>
              <div className='text-2xl font-extrabold mb-4'>Chat Page</div>
                <Card>
                  <CardContent>
                    <div className='w-full h-96 grid grid-rows-7 grid-flow-col gap-4'>
                      <div className='col-span-3 row-span-1'>
                          <div className='grid grid-cols-3 text-left'>
                            <div className='px-2'>Recent Message</div>
                            <div className='col-span-2'>
                              <div className='ml-2'>
                                <div className='font-bold'>User Name</div>
                              </div>
                            </div>
                          </div>
                      </div>
                      <div className='row-span-6 border-r-2 border-gray-200'>
                          <div className='border-2 rounded-2xl p-2 m-2'>
                              Hello
                          </div>
                      </div>
                      <div className='col-span-2 row-span-6'>
                          Hello
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
    </AppLayout>
  );
}
import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import { MessageSquarePlus, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatPage() {
  return (
    <AppLayout>
        <Head title="Chat" />
            <div className='w-full h-full p-4 grid grid-rows'>
              <div className='text-2xl font-extrabold mb-4'>Chat Page</div>
                <Card>
                  <CardContent>
                    <div className='grid grid-cols-3'>
                      <div className='flex justify-between items-center'>
                        <div>
                          Recent Message
                        </div>
                       <div>
                         <button className='border-2 rounded-sm p-1 border-gray-200 hover:bg-gray-700' type='button'>
                            <MessageSquarePlus></MessageSquarePlus>
                          </button>
                       </div>
                      </div>
                      <div className='col-span-2 flex justify-start items-center ml-4'>
                        <div>
                          Username
                        </div>
                      </div>
                    </div>
                    <Separator className='m-3'></Separator>
                    <div className='grid grid-cols-3'>
                       <div className='border-r-2 border-gray-400'>
                        <button className='border-2 rounded-full p-3 w-95 hover:bg-gray-500 text-left' type='button'>
                          Sample Button
                        </button>
                      </div>
                      <div className='col-span-2 ml-2'>
                        <div className='grid grid-rows-3 p-2'>
                          <div className='row-span-3'>
                            <ScrollArea className='h-146'>

                            </ScrollArea>
                          </div>
                          <div className='row-span-1'>
                            <InputGroup>
                              <InputGroupInput placeholder='Type your message here...' />
                              <InputGroupAddon align={'inline-end'}>
                                <InputGroupButton className='border-2 rounded-full p-3 hover:bg-slate-900 text-left'><Send /></InputGroupButton>
                              </InputGroupAddon>
                            </InputGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
    </AppLayout>
  );
}
import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import { MessageSquarePlus, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChatMessage, MessageBubble } from '@/components/ui/message-bubble';
import { Autocomplete, AutocompleteEmpty, AutocompleteInput, AutocompleteItem, AutocompleteList, AutocompletePopup, AutocompletePositioner, AutocompleteClear } from "@/components/ui/autocomplete";
import { Friends } from '@/types/messageTypes';

export default function ChatPage({Friends}: {Friends: Friends[]}) {

  const form = useForm({ message: '', receiver_id: 1});
  
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.post('/sendMessage', {
      onSuccess: () => form.reset('message'),
    });
  };
  console.log(Friends);
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
                      </div>
                      <div className='col-span-2 flex justify-start items-center ml-4'>
                        <div>
                          Username
                        </div>
                      </div>
                    </div>
                    <Separator className='m-3'></Separator>
                    <div className='grid grid-cols-3'>
                      <div className='grid grid-row border-r-2 pr-2'>
                        <div className='flex flex-row'>
                          <Autocomplete items={Friends}>
                            <AutocompleteInput className="relative" placeholder='Search friend to message' id="friends"/>
                            <AutocompleteClear className="absolute right-263 px-2 mt-2.5" />
                            <AutocompletePositioner sideOffset={6}>
                              <AutocompletePopup>
                                <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
                                <AutocompleteList>
                                {(Friends) => (
                                  <AutocompleteItem key={Friends.id} value={Friends.value}>
                                    {Friends.value}
                                  </AutocompleteItem>
                                )}
                                </AutocompleteList>
                              </AutocompletePopup>
                            </AutocompletePositioner>
                          </Autocomplete>
                          <Button className="ml-2"><MessageSquarePlus/></Button>
                        </div>
                        <div>
                          
                        </div>
                      </div>
                      <div className='col-span-2 ml-2'>
                        <div className='grid grid-rows-3 p-2'>
                          <div className='row-span-3'>
                            <ScrollArea className='h-146'>
                              <div className='flex w-full flex-col p-3 gap-3'>
                                  <MessageBubble message='Hello' variant='sent'/>
                              </div>
                            </ScrollArea>
                          </div>
                          <div className='row-span-1'>
                            <form onSubmit={submit}>
                              <InputGroup>
                                <InputGroupInput placeholder='Type your message here...' value={form.data.message} onChange={e => form.setData('message', e.target.value)} />
                                <input type='hidden' name='receiver_id' value={form.data.receiver_id} />
                                <InputGroupAddon align={'inline-end'}>
                                  <InputGroupButton className='border-2 rounded-full p-3 hover:bg-slate-900 text-left' type='submit'><Send /></InputGroupButton>
                                </InputGroupAddon>
                              </InputGroup>
                            </form>
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
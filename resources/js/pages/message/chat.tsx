import AppLayout from '@/layouts/app-layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from '@inertiajs/react';
import { MessageBubble } from '@/components/ui/message-bubble';
import { Autocomplete, AutocompleteEmpty, AutocompleteInput, AutocompleteItem, AutocompleteList, AutocompletePopup, AutocompletePositioner, AutocompleteClear } from "@/components/ui/autocomplete";
import { Friends } from '@/types/messageTypes';
import { type SharedData } from '@/types';

export default function ChatPage({Friends, chat}: {Friends: Friends[], chat: any}) {
  const { auth } = usePage<SharedData>().props;
  const form = useForm({ message: '', chat_id: '' });
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [chatData, setChatData] = useState<{chat: any, messages: any[]} | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const fetchMessages = () => {
    if (selectedFriend) {
      fetch(`/getChatMessages?receiver_id=${selectedFriend}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => {
        setChatData(data);
        form.setData('chat_id', data.chat.id);
        setIsInitialLoad(true);
      })
      .catch(error => {
        console.error('Error fetching chat messages:', error);
      });
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.data.message.trim() || !form.data.chat_id) {
      return;
    }
    form.post('/sendMessage', {
      onSuccess: () => {
        form.reset('message');
        fetchMessages();
      },
    });
  };

  const formatDate = (date: string) => {
      return new Date(date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  };

  useEffect(() => {
    fetchMessages();
    
    // Clear the autocomplete input after friend is selected
    if (selectedFriend) {
      setTimeout(() => {
        const clearButton = autocompleteRef.current?.querySelector('[data-slot="autocomplete-clear"]') as HTMLButtonElement;
        if (clearButton) {
          clearButton.click();
        } else {
          const docClearButton = document.querySelector('[data-slot="autocomplete-clear"]') as HTMLButtonElement;
          if (docClearButton) {
            docClearButton.click();
          } else {
            const input = document.querySelector('#friends') as HTMLInputElement;
            if (input) {
              input.value = '';
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        }
      }, 50);
    }
  }, [selectedFriend]);

  // Sort messages by created_at (oldest first, newest at bottom)
  const sortedMessages = useMemo(() => {
    if (!chatData?.messages) return [];
    return [...chatData.messages].sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return aTime - bTime; // oldest first, newest at bottom
    });
  }, [chatData?.messages]);

  // Scroll to bottom when messages are loaded or updated
  useEffect(() => {
    if (sortedMessages.length > 0) {
      // Use requestAnimationFrame and setTimeout to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        setTimeout(() => {
          const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
          if (viewport) {
            if (isInitialLoad) {
              // Instant scroll for initial load
              viewport.scrollTop = viewport.scrollHeight;
              setIsInitialLoad(false);
            } else {
              // Smooth scroll for new messages
              viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: 'smooth'
              });
            }
          } else if (messagesEndRef.current) {
            // Fallback to scrollIntoView
            messagesEndRef.current.scrollIntoView({ 
              behavior: isInitialLoad ? 'auto' : 'smooth' 
            });
            if (isInitialLoad) {
              setIsInitialLoad(false);
            }
          }
        }, 200);
      });
    }
  }, [sortedMessages.length, chatData?.messages, isInitialLoad]);

  const sortedChat = useMemo(() => {
    return [...chat].sort((a, b) => {
        const aTime = new Date(a.updated_at).getTime();
        const bTime = new Date(b.updated_at).getTime();
        return bTime - aTime; // newest first
    });
}, [chat]);

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
                          {chatData?.chat.user_id === auth.user.id ? chatData?.chat.receiver_name : chatData?.chat.user_name || 'Select a friend to message'}
                        </div>
                      </div>
                    </div>
                    <Separator className='m-3'></Separator>
                    <div className='grid grid-cols-3'>
                      <div className='grid grid-rows-10 border-r-2 pr-2'>
                        <div className='flex flex-row'>
                          <div className="relative w-full" ref={autocompleteRef}>
                            <Autocomplete items={Friends}>
                              <AutocompleteInput className="w-full pr-8" placeholder='Search friend to message' id="friends"/>
                              <AutocompleteClear className="absolute right-2 top-1/4 -translate-y-1/2 z-20 cursor-pointer" />
                              <AutocompletePositioner sideOffset={6}>
                              <AutocompletePopup>
                                <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
                                <AutocompleteList>
                                {(Friends) => (
                                  <AutocompleteItem key={Friends.id} value={Friends.value} onClick={() => {
                                    setSelectedFriend(Friends.id);
                                  }}>
                                    {Friends.value}
                                  </AutocompleteItem>
                                )}
                                </AutocompleteList>
                              </AutocompletePopup>
                              </AutocompletePositioner>
                            </Autocomplete>
                          </div>
                        </div>
                        {sortedChat.map((chat: any) => (
                          <div key={chat.id} className='border border-gray-300 rounded-md p-2 mb-4' onClick={() => setSelectedFriend(chat.user_id === auth.user.id ? chat.receiver_id : chat.user_id)}>
                            <div className='flex justify-between items-center'>
                              <p className="font-bold text-md">{chat.user_id === auth.user.id ? chat.receiver_name : chat.user_name}</p><span className='text-xs text-gray-500'>{formatDate(chat.created_at)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='col-span-2 ml-2'>
                        <div className='grid grid-rows-3 p-2'>
                          <div className='row-span-3'>
                            <ScrollArea className='h-146' ref={scrollAreaRef}>
                              <div className='flex w-full flex-col p-3 gap-3'>
                                {sortedMessages && sortedMessages.length > 0 ? (
                                  <>
                                    {sortedMessages.map((msg: any) => (
                                      <div key={msg.id} className={`flex w-full ${msg.user_id === auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex flex-col ${msg.user_id === auth.user.id ? 'items-end' : 'items-start'}`}>
                                          <MessageBubble 
                                            message={msg.message} 
                                            variant={msg.user_id === auth.user.id ? 'sent' : 'received'} 
                                            grouped='middle'
                                          />
                                          {msg.created_at && <span className='text-xs text-gray-500 mt-1'>{formatDate(msg.created_at)}</span>}
                                        </div>
                                      </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                  </>
                                ) : (
                                  <div className='text-center text-gray-500 py-8'>
                                    {selectedFriend ? 'No messages yet. Start the conversation!' : 'Select a friend to start chatting'}
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                          <div className='row-span-1'>
                            <form onSubmit={submit}>
                              <InputGroup>
                                <InputGroupInput 
                                  placeholder='Type your message here...' 
                                  value={form.data.message || ''} 
                                  onChange={e => form.setData('message', e.target.value)}
                                  disabled={!selectedFriend || !chatData?.chat.id}
                                />
                                <input type='hidden' name='chat_id' value={form.data.chat_id || ''} />
                                <InputGroupAddon align={'inline-end'}>
                                  <InputGroupButton 
                                    className='border-2 rounded-full p-3 hover:bg-slate-900 text-left' 
                                    {...({ type: 'submit', disabled: !selectedFriend || !chatData?.chat.id } as React.ButtonHTMLAttributes<HTMLButtonElement>)}
                                  >
                                  <Send />
                                  </InputGroupButton>
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
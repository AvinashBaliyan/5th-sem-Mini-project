
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { supportChat } from '@/ai/flows/support-chat';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hello! I'm LAKSHYA AI, your personal support assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        // A slight delay to ensure the new message is rendered before scrolling
        setTimeout(scrollToBottom, 100);
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await supportChat({ history: [...messages, userMessage] });
            const modelMessage: Message = { role: 'model', content: result.message };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'The chatbot is currently unavailable. Please try again later.'
            });
             setMessages(prev => [...prev, { role: 'model', content: "I'm having some trouble connecting right now. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-full flex flex-col border-0 shadow-none bg-transparent">
            <CardHeader className="p-4 border-b">
                <CardTitle className="flex items-center gap-2 text-lg"><Bot className="text-primary"/> LAKSHYA AI</CardTitle>
                <CardDescription>Your personal AI assistant for SAI.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="space-y-4 p-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-end gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {message.role === 'model' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("rounded-lg px-4 py-2 max-w-[85%] shadow-sm min-w-0", message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none')}>
                                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                </div>
                                {message.role === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><User size={20} /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-end gap-3 justify-start">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg px-4 py-2 bg-card border rounded-bl-none flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span className="text-xs text-muted-foreground">Typing...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <div className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

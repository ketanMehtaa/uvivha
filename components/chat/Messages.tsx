import { useEffect, useState, useRef, useCallback } from 'react';
import { getMessages, sendMessage, subscribeToMessages } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  from_id: string;
  to_id: string;
  created_at: string;
}

interface MessagesProps {
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
}

export default function Messages({ currentUserId, otherUserId, otherUserName }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      const scrollHeight = scrollElement.scrollHeight;
      scrollElement.scrollTop = scrollHeight;
    }
  }, []);

  // Scroll on messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(currentUserId, otherUserId);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [currentUserId, otherUserId]);

  // Subscribe to new messages
  useEffect(() => {
    const handleNewMessage = (payload: any) => {
      const newMessage = payload.new;
      
      // Only add messages that belong to this conversation
      if ((newMessage.from_id === currentUserId && newMessage.to_id === otherUserId) ||
          (newMessage.from_id === otherUserId && newMessage.to_id === currentUserId)) {
        setMessages(prev => {
          // Check if message already exists
          if (prev.some(msg => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }
    };

    const unsubscribe = subscribeToMessages(
      currentUserId,
      otherUserId,
      handleNewMessage
    );

    return () => {
      unsubscribe();
    };
  }, [currentUserId, otherUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage.trim(),
      from_id: currentUserId,
      to_id: otherUserId,
      created_at: new Date().toISOString(),
    };

    setLoading(true);
    // Optimistically add the message
    // setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const sentMessage = await sendMessage(currentUserId, otherUserId, tempMessage.content);
      // Replace the temp message with the real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessage.id ? sentMessage : msg)
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temp message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      toast.error('Failed to send message');
      setNewMessage(tempMessage.content); // Restore the message in the input
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{otherUserName}</h2>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-auto p-4"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.from_id === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.from_id === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                } ${message.id.startsWith('temp-') ? 'opacity-70' : ''}`}
              >
                <p className="break-words">{message.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !newMessage.trim()}>
          Send
        </Button>
      </form>
    </Card>
  );
} 
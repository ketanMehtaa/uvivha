import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getConversations, subscribeToAllMessages } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

interface Conversation {
  otherUser: {
    id: string;
    name: string;
    image_url?: string;
  };
  lastMessage: {
    content: string;
    created_at: string;
  };
  unreadCount: number;
}

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    ))}
  </div>
);

export default function ConversationsList({ userId }: { userId: string }) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial conversations
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await getConversations(userId);
        setConversations(data as Conversation[]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to all messages using shared connection
    const unsubscribe = subscribeToAllMessages(async (payload) => {
      const msg = payload.new;
      // Only refresh if message involves current user
      if (msg.from_id === userId || msg.to_id === userId) {
        try {
          const data = await getConversations(userId);
          setConversations(data as Conversation[]);
        } catch (error) {
          console.error('Error refreshing conversations:', error);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  return (
    <Card className="h-[600px]">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      <ScrollArea className="h-[calc(600px-64px)]">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="divide-y">
            {conversations.map((conversation) => (
              <div
                key={conversation.otherUser.id}
                className="p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => router.push(`/messages/${conversation.otherUser.id}`)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={conversation.otherUser.image_url}
                      alt={conversation.otherUser.name}
                    />
                    <AvatarFallback>
                      {conversation.otherUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">
                        {conversation.otherUser.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.lastMessage.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.content}
                    </p>

                    {conversation.unreadCount > 0 && (
                      <div className="mt-1">
                        <span className="inline-flex items-center justify-center h-5 w-5 text-xs bg-primary text-primary-foreground rounded-full">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!loading && conversations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No conversations yet
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
} 
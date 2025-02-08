import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize the Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  }
});

// Shared WebSocket connection manager
type MessageHandler = (payload: any) => void;
let messageChannel: any = null;
const messageHandlers = new Set<MessageHandler>();

export function subscribeToAllMessages(onMessage: MessageHandler) {
  messageHandlers.add(onMessage);

  // Create shared channel if it doesn't exist
  if (!messageChannel) {
    messageChannel = supabase
      .channel('shared_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          // Notify all handlers
          messageHandlers.forEach(handler => handler(payload));
        }
      )
      .subscribe();
  }

  // Return cleanup function
  return () => {
    messageHandlers.delete(onMessage);
    
    // If no more handlers, close the channel
    if (messageHandlers.size === 0 && messageChannel) {
      messageChannel.unsubscribe();
      messageChannel = null;
    }
  };
}

// Helper function to get messages between two users
export async function getMessages(currentUserId: string, otherUserId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('id, content, from_id, to_id, created_at')
    .or(`from_id.eq.${currentUserId},to_id.eq.${currentUserId}`)
    .or(`from_id.eq.${otherUserId},to_id.eq.${otherUserId}`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  // Filter messages to only show conversation between these two users
  return (data || []).filter(
    message => 
      (message.from_id === currentUserId && message.to_id === otherUserId) ||
      (message.from_id === otherUserId && message.to_id === currentUserId)
  );
}

// Helper function to send a message
export async function sendMessage(fromId: string, toId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      from_id: fromId,
      to_id: toId,
      content
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
  return data;
}

// Update subscribeToMessages to use shared connection
export function subscribeToMessages(currentUserId: string, otherUserId: string, onMessage: (message: any) => void) {
  return subscribeToAllMessages((payload) => {
    const msg = payload.new;
    // Only notify if message is part of this conversation
    if ((msg.from_id === currentUserId && msg.to_id === otherUserId) ||
        (msg.from_id === otherUserId && msg.to_id === currentUserId)) {
      onMessage(payload);
    }
  });
}

// Helper function to get all conversations for a user
export async function getConversations(userId: string) {
  // Get all messages involving the user
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .or(`from_id.eq.${userId},to_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (messagesError) {
    console.error('Error fetching messages:', messagesError);
    throw messagesError;
  }

  if (!messages?.length) {
    return [];
  }

  // Get unique user IDs from messages
  const userIds = new Set(
    messages.flatMap(msg => [msg.from_id, msg.to_id]).filter(id => id !== userId)
  );

  // Fetch user details from your API
  const userPromises = Array.from(userIds).map(async (id) => {
    const res = await fetch(`/api/profiles/${id}`);
    const data = await res.json();
    return data.profile;
  });

  const users = await Promise.all(userPromises);
  const usersMap = users.reduce((acc, user) => {
    if (user) {
      acc[user.id] = user;
    }
    return acc;
  }, {} as Record<string, any>);

  // Group messages by conversation and get the latest message
  const conversations = messages.reduce((acc: any, message: any) => {
    const otherUserId = message.from_id === userId ? message.to_id : message.from_id;
    const otherUser = usersMap[otherUserId];
    
    if (!acc[otherUserId] && otherUser) {
      acc[otherUserId] = {
        otherUser: {
          id: otherUser.id,
          name: otherUser.name,
          image_url: otherUser.image_url
        },
        lastMessage: {
          content: message.content,
          created_at: message.created_at
        },
        unreadCount: message.from_id !== userId && !message.read ? 1 : 0
      };
    }
    
    return acc;
  }, {});

  return Object.values(conversations);
} 
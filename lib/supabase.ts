import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Function to get current user ID from localStorage
const getCurrentUserId = () => {
  if (typeof window === 'undefined') return null;
  try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.id;
    }
  } catch (error) {
    console.error('Error getting user ID from localStorage:', error);
  }
  return null;
};

// Initialize the Supabase client with additional options
export const createSupabaseClient = () => {
  const userId = getCurrentUserId();
  
  if (!userId) {
    console.warn('No user ID found when creating Supabase client');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        'user_id': userId || ''
      }
    },
    realtime: {
      params: {
        headers: {
          'user_id': userId || ''
        }
      }
    }
  });
};

// Create a new client instance
export const supabase = createSupabaseClient();

// Shared WebSocket connection manager
type MessageHandler = (payload: any) => void;
let messageChannel: any = null;
const messageHandlers = new Set<MessageHandler>();

export function subscribeToAllMessages(onMessage: MessageHandler) {
  // Create a new client with current user ID
  const supabaseClient = createSupabaseClient();
  messageHandlers.add(onMessage);

  // Create shared channel if it doesn't exist
  if (!messageChannel) {
    messageChannel = supabaseClient
      .channel('shared_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          messageHandlers.forEach(handler => handler(payload));
        }
      )
      .subscribe();
  }

  return () => {
    messageHandlers.delete(onMessage);
    if (messageHandlers.size === 0 && messageChannel) {
      messageChannel.unsubscribe();
      messageChannel = null;
    }
  };
}

// Helper function to get messages between two users
export async function getMessages(currentUserId: string, otherUserId: string) {
  // Ensure we have a valid user ID in headers
  const client = createSupabaseClient();
  
  const { data, error } = await client
    .from('messages')
    .select('id, content, from_id, to_id, created_at')
    .or(`and(from_id.eq.${currentUserId},to_id.eq.${otherUserId}),and(from_id.eq.${otherUserId},to_id.eq.${currentUserId})`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data || [];
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
  // Create a new client with current user ID
  const client = createSupabaseClient();
  
  const { data: messages, error: messagesError } = await client
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

  // Fetch user details
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

  // Group messages by conversation
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

// Helper function to send a message
export async function sendMessage(fromId: string, toId: string, content: string) {
  // Prevent self-messaging as per policy
  if (fromId === toId) {
    throw new Error('Cannot send messages to yourself');
  }

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

  // Send push notification
  try {
    await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: toId,
        notification: {
          title: 'New Message',
          body: content,
          data: {
            type: 'message',
            fromId,
            toId,
            messageId: data.id
          }
        }
      })
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
  }

  return data;
} 
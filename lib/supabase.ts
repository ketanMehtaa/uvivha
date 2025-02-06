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

// Helper function to create a real-time subscription for messages
export function subscribeToMessages(currentUserId: string, otherUserId: string, onMessage: (message: any) => void) {
  const channel = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      (payload) => {
        console.log('New message received:', payload);
        onMessage(payload);
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
} 
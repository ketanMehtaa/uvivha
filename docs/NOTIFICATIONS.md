# Push Notification System Documentation

## Overview
The application implements a web push notification system for real-time message notifications using Service Workers, Web Push API, and Supabase real-time features.

## Architecture Components

### 1. Service Worker (`worker/sw.js`)
```javascript
// Core service worker functionality
- Cache management (CACHE_NAME = 'hamy-cache-v3')
- Installation and activation handlers
- Push event handling
- Notification click handling
```

### 2. Message System (`lib/supabase.ts`)
```typescript
// Handles both real-time messages and notifications
export async function sendMessage(fromId: string, toId: string, content: string) {
  // 1. Save message to Supabase
  // 2. Trigger push notification
  // 3. Handle real-time updates
}
```

### 3. Push Notification API Routes
```typescript
// Three main routes handle push notifications:

a) /api/push/subscribe
- Stores user's push subscription
- Links subscription to user ID
- Handles subscription updates

b) /api/push/send
- Sends notifications to specific users
- Validates sender's authentication
- Manages notification payload

c) /api/push/verify-subscription
- Verifies subscription status
- Validates subscription tokens
```

## Flow Diagram
```
1. Subscription Flow:
User enables notifications → Service Worker registration → Store subscription in database

2. Message & Notification Flow:
User A sends message → Save to Supabase → Trigger notification → Service Worker → Show notification to User B
```

## Implementation Details

### 1. Push Subscription Storage
```typescript
// Database schema for push subscriptions
PushSubscription {
  userId: string
  endpoint: string
  auth: string
  p256dh: string
}

// Subscription storage
await prisma.pushSubscription.upsert({
  where: {
    userId_endpoint: {
      userId: userId,
      endpoint: subscription.endpoint
    }
  },
  // ... create/update logic
});
```

### 2. Notification Sending
```typescript
// Send notification to specific user
await webpush.sendNotification(
  {
    endpoint: subscription.endpoint,
    keys: {
      auth: subscription.auth,
      p256dh: subscription.p256dh
    }
  },
  JSON.stringify({
    title: 'New Message',
    body: content,
    data: {
      type: 'message',
      fromId,
      toId,
      messageId: data.id
    }
  })
);
```

### 3. Service Worker Handlers
```javascript
// Push event handler
self.addEventListener('push', (event) => {
  const data = event.data.json();
  // Show notification with proper formatting
});

// Click handler
self.addEventListener('notificationclick', (event) => {
  // Navigate to appropriate chat/message
});
```

## Security Features

1. **Authentication**
```typescript
// JWT verification for all notification operations
const token = cookieStore.get('auth-token')?.value;
const { payload } = await jose.jwtVerify(token, secret);
```

2. **Subscription Validation**
- Unique per user/browser combination
- Automatic cleanup of invalid subscriptions
- Secure key storage

3. **VAPID Authentication**
```typescript
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);
```

## Error Handling

1. **Subscription Errors**
```typescript
// Handle invalid subscriptions
if ((error as any).statusCode === 410) {
  await prisma.pushSubscription.delete({
    where: {
      userId_endpoint: {
        userId: subscription.userId,
        endpoint: subscription.endpoint
      }
    }
  });
}
```

2. **Message Delivery**
- Graceful fallback if notification fails
- Message delivery independent of notification success
- Real-time updates as backup

## Integration with Existing Features

1. **Real-time Messages**
- Works alongside Supabase real-time subscriptions
- Provides redundancy for message delivery
- Enhances user experience with immediate notifications

2. **Caching Strategy**
```javascript
// Service worker caching
const CACHE_NAME = 'hamy-cache-v3';
const NO_CACHE_PATHS = [
  // Paths that should never be cached
];
```

## Required Environment Variables
```env
VAPID_EMAIL=your-email@example.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
JWT_SECRET=your-secret-key
```

## Best Practices Implemented
1. Separate concerns (messaging vs. notifications)
2. Proper error handling
3. Security-first approach
4. Graceful degradation
5. Clean user experience

## Testing

### 1. Prerequisites
- Ensure all environment variables are set
- Service worker is registered
- User has granted notification permissions

### 2. Test Cases
1. Send message when recipient has notifications enabled
2. Send message when recipient has notifications disabled
3. Send message when recipient's subscription is invalid
4. Click notification to navigate to chat
5. Test offline behavior
6. Test subscription renewal

### 3. Common Issues
1. Missing VAPID keys
2. Invalid subscription data
3. Service worker registration failures
4. Permission denials

## Maintenance

### 1. Regular Tasks
- Monitor invalid subscription cleanup
- Check notification delivery rates
- Update service worker cache version when needed
- Review security tokens and VAPID keys

### 2. Updates
- Keep web-push library updated
- Monitor browser compatibility changes
- Update security practices as needed 
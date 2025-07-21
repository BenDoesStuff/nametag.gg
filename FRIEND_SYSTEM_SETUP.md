# 🎮 Nametag Friend System Setup Guide

## Overview
Complete friend system implementation for the Nametag platform with real-time features, search, and mobile-friendly UI.

## 🚀 Setup Instructions

### 1. Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of database/friend_system_schema.sql
```

This will create:
- `friend_requests` table with proper constraints
- RLS policies for security
- Helper views for easy querying
- Search optimization indexes

### 2. Install Dependencies

The required dependencies should already be installed:
- `@supabase/auth-helpers-nextjs`: For API route authentication
- `@supabase/supabase-js`: Core Supabase client

### 3. Environment Variables

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Test the System

Navigate to `/friends` to start using the friend system!

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── friends/
│   │   │   ├── request/route.ts     # Send friend requests
│   │   │   ├── accept/route.ts      # Accept requests
│   │   │   ├── decline/route.ts     # Decline requests
│   │   │   ├── list/route.ts        # Get friends list
│   │   │   └── pending/route.ts     # Get pending requests
│   │   └── users/
│   │       └── search/route.ts      # Search users
│   └── friends/page.tsx             # Friends dashboard
├── components/
│   ├── FriendSearch.tsx             # Search & add friends
│   ├── FriendRequests.tsx           # Manage requests
│   └── FriendList.tsx               # Display friends
└── hooks/
    └── useFriends.ts                # Friend data hooks
```

## 🔧 API Endpoints

### `POST /api/friends/request`
Send a friend request
```json
{
  "recipient_username": "string"
}
```

### `POST /api/friends/accept`
Accept a friend request
```json
{
  "request_id": "uuid"
}
```

### `POST /api/friends/decline`
Decline a friend request
```json
{
  "request_id": "uuid"
}
```

### `GET /api/friends/list`
Get user's friends list
```json
{
  "friends": [
    {
      "friend_id": "uuid",
      "username": "string",
      "display_name": "string",
      "avatar_url": "string",
      "friendship_date": "timestamp"
    }
  ]
}
```

### `GET /api/friends/pending`
Get pending requests (incoming/outgoing)
```json
{
  "incoming": [...],
  "outgoing": [...]
}
```

### `GET /api/users/search?q=query`
Search users by username or display name
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "string",
      "display_name": "string",
      "avatar_url": "string",
      "friendStatus": "none|friends|request_sent|request_received"
    }
  ]
}
```

## 🎨 UI Components

### FriendSearch
- Real-time search with debouncing
- Shows friend status for each user
- Add friend functionality
- Mobile-responsive dropdown

### FriendRequests
- Separate incoming/outgoing sections
- Accept/decline buttons
- Real-time updates
- User profile previews

### FriendList
- Grid layout for friends
- Clickable friend cards
- Empty state handling
- Profile link integration

## 🔐 Security Features

### RLS Policies
- Users can only send requests as themselves
- Users can only view requests they're involved in
- Only recipients can accept/decline requests
- Prevents duplicate and self-requests

### Input Validation
- Username existence checking
- Duplicate request prevention
- Self-request blocking
- Case-insensitive search

## 📱 Mobile Features

- Responsive grid layouts
- Touch-friendly buttons
- Collapsible search results
- Optimized for small screens

## 🔄 Manual Refresh Features

### Auto-refresh Triggers
- Lists refresh after sending requests
- Updates after accepting/declining
- Search results update friend status
- Navigation triggers fresh data

## 🧪 Testing

### Manual Testing Checklist
1. ✅ Sign up two test accounts
2. ✅ Search for users
3. ✅ Send friend requests
4. ✅ Accept/decline requests
5. ✅ View friends list
6. ✅ Check list updates after actions
7. ✅ Test mobile responsiveness

### Edge Cases Covered
- Duplicate request prevention
- Self-friend request blocking
- Case-insensitive search
- Request status validation
- Authentication requirements

## 🚀 Usage

1. Navigate to `/friends` for the main dashboard
2. Use the search bar to find users
3. Send friend requests with "Add Friend" button
4. Manage incoming requests in the requests section
5. View all friends in the friends grid
6. Click friend cards to visit their profiles

## 🎯 Performance Optimizations

- Debounced search (300ms)
- Indexed database queries
- Efficient RLS policies
- Paginated search results (20 max)
- Optimized React re-renders

## 🔮 Future Enhancements

- Friend groups/categories
- Friend activity feeds
- Mutual friends display
- Friend recommendations
- Block/unblock functionality
- Friend request message system

## 🐛 Troubleshooting

### Common Issues

1. **"Authentication required" errors**
   - Check if user is logged in
   - Verify API route authentication

2. **RLS policy violations**
   - Ensure database schema is applied
   - Check policy permissions

3. **Search not working**
   - Verify search indexes are created
   - Check case sensitivity handling

4. **Lists not updating**
   - Navigate away and back to refresh
   - Check browser console for errors

### Debug Mode
Add `console.log` statements are included in hooks for debugging. Check browser console for detailed operation logs.
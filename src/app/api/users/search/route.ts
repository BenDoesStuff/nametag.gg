import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({
        users: []
      });
    }

    // Get current user to exclude from results
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Search users by username or display name (case-insensitive)
    const searchTerm = query.toLowerCase().trim();
    
    const { data: users, error: searchError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`)
      .neq('id', user.id) // Exclude current user
      .limit(20)
      .order('username');

    if (searchError) {
      console.error('User search error:', searchError);
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      );
    }

    // Get friend status for each user
    const userIds = users?.map(u => u.id) || [];
    
    const friendStatuses: Record<string, string> = {};
    
    if (userIds.length > 0) {
      const { data: friendRequests } = await supabase
        .from('friend_requests')
        .select('requester, recipient, status')
        .or(
          userIds.map(id => 
            `and(requester.eq.${user.id},recipient.eq.${id}),and(requester.eq.${id},recipient.eq.${user.id})`
          ).join(',')
        );

      friendRequests?.forEach(request => {
        const otherUserId = request.requester === user.id ? request.recipient : request.requester;
        
        if (request.status === 'accepted') {
          friendStatuses[otherUserId] = 'friends';
        } else if (request.status === 'pending') {
          if (request.requester === user.id) {
            friendStatuses[otherUserId] = 'request_sent';
          } else {
            friendStatuses[otherUserId] = 'request_received';
          }
        }
      });
    }

    // Add friend status to each user
    const usersWithStatus = users?.map(user => ({
      ...user,
      friendStatus: friendStatuses[user.id] || 'none'
    }));

    return NextResponse.json({
      users: usersWithStatus || []
    });

  } catch (error) {
    console.error('User search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { recipient_username } = await request.json();

    // Validate input
    if (!recipient_username) {
      return NextResponse.json(
        { error: 'Recipient username is required' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Find recipient by username
    const { data: recipient, error: recipientError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', recipient_username.toLowerCase())
      .single();

    if (recipientError || !recipient) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-friend requests
    if (recipient.id === user.id) {
      return NextResponse.json(
        { error: 'Cannot send friend request to yourself' },
        { status: 400 }
      );
    }

    // Check if request already exists (in any direction)
    const { data: existingRequest } = await supabase
      .from('friend_requests')
      .select('id, status, requester, recipient')
      .or(`and(requester.eq.${user.id},recipient.eq.${recipient.id}),and(requester.eq.${recipient.id},recipient.eq.${user.id})`)
      .neq('status', 'declined')
      .single();

    if (existingRequest) {
      if (existingRequest.status === 'accepted') {
        return NextResponse.json(
          { error: 'You are already friends with this user' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Friend request already exists' },
        { status: 400 }
      );
    }

    // Create friend request
    const { data: friendRequest, error: insertError } = await supabase
      .from('friend_requests')
      .insert({
        requester: user.id,
        recipient: recipient.id,
        status: 'pending'
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Friend request creation error:', insertError);
      return NextResponse.json(
        { error: 'Failed to send friend request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      request: friendRequest
    });

  } catch (error) {
    console.error('Friend request API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get incoming pending requests (where user is recipient)
    const { data: incomingRequests, error: incomingError } = await supabase
      .from('friend_requests')
      .select(`
        *,
        requester_profile:profiles!friend_requests_requester_fkey(
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('recipient', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    // Get outgoing pending requests (where user is requester)
    const { data: outgoingRequests, error: outgoingError } = await supabase
      .from('friend_requests')
      .select(`
        *,
        recipient_profile:profiles!friend_requests_recipient_fkey(
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('requester', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (incomingError || outgoingError) {
      console.error('Pending requests error:', { incomingError, outgoingError });
      return NextResponse.json(
        { error: 'Failed to fetch pending requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      incoming: incomingRequests || [],
      outgoing: outgoingRequests || []
    });

  } catch (error) {
    console.error('Pending requests API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
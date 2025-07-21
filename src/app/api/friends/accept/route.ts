import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { request_id } = await request.json();

    // Validate input
    if (!request_id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
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

    // Verify request exists and user is the recipient
    const { data: friendRequest, error: fetchError } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('id', request_id)
      .eq('recipient', user.id)
      .eq('status', 'pending')
      .single();

    if (fetchError || !friendRequest) {
      return NextResponse.json(
        { error: 'Friend request not found or already processed' },
        { status: 404 }
      );
    }

    // Update request status to accepted
    const { data: updatedRequest, error: updateError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', request_id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Friend request accept error:', updateError);
      return NextResponse.json(
        { error: 'Failed to accept friend request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      request: updatedRequest
    });

  } catch (error) {
    console.error('Accept friend request API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
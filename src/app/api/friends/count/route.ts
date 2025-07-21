import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const username = searchParams.get('username');

    if (!userId && !username) {
      return NextResponse.json(
        { error: 'Either userId or username parameter is required' },
        { status: 400 }
      );
    }

    let targetUserId = userId;

    // If username provided, get the user ID first
    if (!targetUserId && username) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      targetUserId = profile.id;
    }

    // Get friend count using the database function
    const { data, error } = await supabase
      .rpc('get_user_friend_count', { target_user_id: targetUserId });

    if (error) {
      console.error('Error getting friend count:', error);
      return NextResponse.json(
        { error: 'Failed to get friend count', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      userId: targetUserId,
      username,
      friendCount: data || 0
    });

  } catch (err) {
    console.error('Unexpected error in friend count API:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
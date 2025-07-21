import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Get the session from cookies
    const accessToken = cookieStore.get('sb-access-token')?.value;
    const refreshToken = cookieStore.get('sb-refresh-token')?.value;
    
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Set the session
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get accepted friends using the helper view
    const { data: friends, error: friendsError } = await supabase
      .from('friends')
      .select('*')
      .order('friendship_date', { ascending: false });

    if (friendsError) {
      console.error('Friends list error:', friendsError);
      return NextResponse.json(
        { error: 'Failed to fetch friends list' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      friends: friends || []
    });

  } catch (error) {
    console.error('Friends list API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
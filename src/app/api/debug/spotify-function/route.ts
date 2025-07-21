import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Try to call the function
    const { data, error } = await supabase.rpc('refresh_user_spotify_tracks', {
      user_id: user.id,
      time_range_param: 'short_term'
    });
    
    return NextResponse.json({
      function_exists: !error,
      error: error?.message,
      data,
      user_id: user.id
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
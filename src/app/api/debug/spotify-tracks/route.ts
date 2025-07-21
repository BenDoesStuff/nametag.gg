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

    // Get all tracks for this user
    const { data: tracks, error: tracksError } = await supabase
      .from('profile_spotify_tracks')
      .select('*')
      .eq('profile_id', user.id)
      .order('track_position', { ascending: true });
    
    return NextResponse.json({
      user_id: user.id,
      tracks_count: tracks?.length || 0,
      tracks: tracks || [],
      error: tracksError?.message
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
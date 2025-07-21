/**
 * Spotify Token Refresh API Route
 * Handles refreshing expired Spotify access tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { refreshSpotifyToken, validateSpotifyConfig } from '@/lib/spotify';

export async function POST(request: NextRequest) {
  try {
    validateSpotifyConfig();

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get user's Spotify refresh token
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('spotify_refresh_token')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.spotify_refresh_token) {
      return NextResponse.json(
        { error: 'Spotify not connected or refresh token not found' },
        { status: 404 }
      );
    }

    // Refresh the access token
    const tokens = await refreshSpotifyToken(profile.spotify_refresh_token);

    // Update refresh token if a new one was provided
    if (tokens.refresh_token && tokens.refresh_token !== profile.spotify_refresh_token) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ spotify_refresh_token: tokens.refresh_token })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating refresh token:', updateError);
        // Non-blocking error - token refresh still succeeded
      }
    }

    return NextResponse.json({
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // If refresh token is invalid, clear Spotify connection
    if (error instanceof Error && error.message.includes('refresh')) {
      try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase
            .from('profiles')
            .update({
              spotify_refresh_token: null,
              spotify_display_name: null,
              spotify_user_id: null,
              spotify_connected_at: null,
            })
            .eq('id', user.id);

          // Also clear stored tracks
          await supabase
            .from('profile_spotify_tracks')
            .delete()
            .eq('profile_id', user.id);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up invalid Spotify connection:', cleanupError);
      }

      return NextResponse.json(
        { error: 'Spotify connection expired. Please reconnect.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to refresh Spotify token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
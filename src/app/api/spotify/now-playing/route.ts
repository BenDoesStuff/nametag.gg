/**
 * Spotify Now Playing API Route
 * Fetches user's currently playing track
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { 
  getCurrentlyPlaying, 
  refreshSpotifyToken, 
  getAlbumArtUrl,
  validateSpotifyConfig 
} from '@/lib/spotify';

export async function GET(request: NextRequest) {
  try {
    validateSpotifyConfig();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Determine which user's now playing to fetch
    let targetUserId: string;
    
    if (userId) {
      // Fetching for a specific user (public view)
      targetUserId = userId;
    } else {
      // Fetching for current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        );
      }
      targetUserId = user.id;
    }

    // Get user's Spotify refresh token
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('spotify_refresh_token, spotify_user_id')
      .eq('id', targetUserId)
      .single();

    if (profileError || !profile?.spotify_refresh_token) {
      return NextResponse.json({
        isPlaying: false,
        track: null,
        message: 'Spotify not connected'
      });
    }

    // Get fresh access token
    let accessToken: string;
    try {
      const tokens = await refreshSpotifyToken(profile.spotify_refresh_token);
      accessToken = tokens.access_token;

      // Update refresh token if changed
      if (tokens.refresh_token && tokens.refresh_token !== profile.spotify_refresh_token) {
        await supabase
          .from('profiles')
          .update({ spotify_refresh_token: tokens.refresh_token })
          .eq('id', targetUserId);
      }
    } catch (tokenError) {
      console.error('Token refresh failed:', tokenError);
      return NextResponse.json({
        isPlaying: false,
        track: null,
        message: 'Spotify authentication expired'
      });
    }

    // Get currently playing track
    const currentlyPlaying = await getCurrentlyPlaying(accessToken);

    if (!currentlyPlaying || !currentlyPlaying.item || !currentlyPlaying.is_playing) {
      return NextResponse.json({
        isPlaying: false,
        track: null,
        message: 'Not currently playing'
      });
    }

    const track = currentlyPlaying.item;
    
    // Format response
    const response = {
      isPlaying: currentlyPlaying.is_playing,
      track: {
        id: track.id,
        title: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        albumArt: getAlbumArtUrl(track.album.images, 'small'),
        externalUrl: track.external_urls.spotify,
        previewUrl: track.preview_url,
        durationMs: track.duration_ms,
        progressMs: currentlyPlaying.progress_ms,
      },
      timestamp: currentlyPlaying.timestamp || Date.now()
    };

    // Cache for 30 seconds to avoid hitting rate limits
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=30, s-maxage=30',
      },
    });

  } catch (error) {
    console.error('Now playing error:', error);
    
    // Handle token expiration gracefully
    if (error instanceof Error && error.message === 'SPOTIFY_TOKEN_EXPIRED') {
      return NextResponse.json({
        isPlaying: false,
        track: null,
        message: 'Spotify session expired'
      });
    }

    // Handle rate limiting
    if (error instanceof Error && error.message === 'SPOTIFY_RATE_LIMITED') {
      return NextResponse.json({
        isPlaying: false,
        track: null,
        message: 'Rate limited'
      }, {
        headers: {
          'Retry-After': '60', // Retry after 1 minute
        },
      });
    }

    return NextResponse.json({
      isPlaying: false,
      track: null,
      message: 'Error fetching now playing',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// For testing purposes, allow POST to manually trigger refresh
export async function POST(request: NextRequest) {
  try {
    const { forceRefresh } = await request.json();
    
    if (!forceRefresh) {
      return NextResponse.json(
        { error: 'forceRefresh parameter required' },
        { status: 400 }
      );
    }

    // Call GET with no-cache
    const url = new URL(request.url);
    const getRequest = new NextRequest(url, {
      method: 'GET',
      headers: new Headers({
        ...Object.fromEntries(request.headers.entries()),
        'Cache-Control': 'no-cache',
      }),
    });

    return GET(getRequest);

  } catch (error) {
    console.error('Force refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to force refresh' },
      { status: 500 }
    );
  }
}
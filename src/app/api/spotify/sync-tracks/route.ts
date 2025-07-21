/**
 * Spotify Track Sync API Route
 * Fetches and stores user's top tracks from Spotify
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';
import { 
  getTopTracks, 
  getAlbumArtUrl, 
  validateSpotifyConfig 
} from '@/lib/spotify';

export async function POST(request: NextRequest) {
  try {
    validateSpotifyConfig();

    // Get access token from Authorization header or request body
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createServerClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { timeRange = 'short_term', limit = 10 } = await request.json().catch(() => ({}));

    // Validate time range
    if (!['short_term', 'medium_term', 'long_term'].includes(timeRange)) {
      return NextResponse.json(
        { error: 'Invalid time range. Must be short_term, medium_term, or long_term' },
        { status: 400 }
      );
    }

    // Fetch top tracks from Spotify
    const topTracksResponse = await getTopTracks(accessToken, timeRange, limit);
    
    if (!topTracksResponse.items || topTracksResponse.items.length === 0) {
      return NextResponse.json({
        message: 'No tracks found',
        syncedCount: 0
      });
    }

    // Clear existing tracks for this time range
    console.log('Clearing existing tracks for user:', user.id, 'timeRange:', timeRange);
    const { error: deleteError } = await supabase
      .from('profile_spotify_tracks')
      .delete()
      .eq('profile_id', user.id)
      .eq('time_range', timeRange);
      
    if (deleteError) {
      console.error('Error deleting existing tracks:', deleteError);
    } else {
      console.log('Successfully cleared existing tracks');
    }

    // Prepare track data for insertion
    const tracksToInsert = topTracksResponse.items.map((track, index) => ({
      profile_id: user.id,
      track_id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      album_art_url: getAlbumArtUrl(track.album.images, 'medium'),
      preview_url: track.preview_url,
      external_url: track.external_urls.spotify,
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      time_range: timeRange,
      track_position: index + 1,
    }));

    // Insert tracks into database
    console.log('Inserting tracks:', tracksToInsert.length, 'tracks');
    console.log('Sample track data:', tracksToInsert[0]);
    
    const { data: insertedTracks, error: insertError } = await supabase
      .from('profile_spotify_tracks')
      .upsert(tracksToInsert, {
        onConflict: 'profile_id,track_id,time_range'
      })
      .select();

    if (insertError) {
      console.error('Error inserting Spotify tracks:', insertError);
      console.error('Insert error details:', JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { error: 'Failed to save tracks to database', details: insertError.message },
        { status: 500 }
      );
    }
    console.log('Successfully inserted', insertedTracks?.length, 'tracks');

    return NextResponse.json({
      message: 'Tracks synced successfully',
      syncedCount: insertedTracks?.length || 0,
      timeRange,
      tracks: insertedTracks
    });

  } catch (error) {
    console.error('Track sync error:', error);
    
    // Handle token expiration
    if (error instanceof Error && error.message === 'SPOTIFY_TOKEN_EXPIRED') {
      return NextResponse.json(
        { error: 'Spotify token expired', requiresRefresh: true },
        { status: 401 }
      );
    }

    // Handle rate limiting
    if (error instanceof Error && error.message === 'SPOTIFY_RATE_LIMITED') {
      return NextResponse.json(
        { error: 'Spotify API rate limited. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to sync Spotify tracks',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createServerClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'short_term';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user's stored tracks
    const { data: tracks, error: tracksError } = await supabase
      .from('profile_spotify_tracks')
      .select('*')
      .eq('profile_id', user.id)
      .eq('time_range', timeRange)
      .order('track_position', { ascending: true })
      .limit(limit);

    if (tracksError) {
      console.error('Error fetching user tracks:', tracksError);
      return NextResponse.json(
        { error: 'Failed to fetch tracks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      tracks: tracks || [],
      timeRange,
      count: tracks?.length || 0
    });

  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}
/**
 * Spotify OAuth Link API Route
 * Handles the initial OAuth flow and token exchange
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';
import { 
  exchangeCodeForTokens, 
  getSpotifyProfile, 
  validateSpotifyConfig 
} from '@/lib/spotify';

export async function GET(request: NextRequest) {
  console.log('=== SPOTIFY CALLBACK DEBUG ===');
  try {
    validateSpotifyConfig();
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    
    console.log('Callback params:', { code: code?.substring(0, 20) + '...', error, state });

    // Handle OAuth error
    if (error) {
      console.error('Spotify OAuth error:', error);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
      return NextResponse.redirect(
        new URL('/profile-editor?error=spotify_auth_failed', baseUrl)
      );
    }

    // Handle missing code
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
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

    // Exchange code for tokens
    console.log('Exchanging code for tokens...');
    const tokens = await exchangeCodeForTokens(code);
    console.log('Tokens received:', { access_token: tokens.access_token?.substring(0, 20) + '...', refresh_token: !!tokens.refresh_token });

    // Get Spotify profile information
    console.log('Getting Spotify profile...');
    const spotifyProfile = await getSpotifyProfile(tokens.access_token);
    console.log('Spotify profile:', { id: spotifyProfile.id, display_name: spotifyProfile.display_name });

    // Update user profile with Spotify data
    console.log('Updating user profile...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        spotify_refresh_token: tokens.refresh_token,
        spotify_display_name: spotifyProfile.display_name,
        spotify_user_id: spotifyProfile.id,
        spotify_connected_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile with Spotify data:', updateError);
      return NextResponse.json(
        { error: 'Failed to save Spotify connection', details: updateError.message },
        { status: 500 }
      );
    }
    console.log('Profile updated successfully!');

    // Trigger initial sync of top tracks
    try {
      await fetch(`${request.nextUrl.origin}/api/spotify/sync-tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (syncError) {
      console.warn('Failed to sync tracks immediately:', syncError);
      // Non-blocking error - connection still succeeded
    }

    // Redirect back to profile edit with success
    const redirectUrl = state || '/profile-editor';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    return NextResponse.redirect(
      new URL(`${redirectUrl}?success=spotify_connected`, baseUrl)
    );

  } catch (error) {
    console.error('Spotify linking error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect Spotify account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    validateSpotifyConfig();

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

    const { redirect } = await request.json();

    // Generate state parameter for security
    const state = redirect || '/profile-editor';

    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
    
    // Debug logging
    console.log('=== SPOTIFY OAUTH DEBUG ===');
    console.log('Client ID:', process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID);
    console.log('Redirect URI:', redirectUri);
    console.log('Request Origin:', request.nextUrl.origin);
    console.log('===========================');

    // Return OAuth URL for client-side redirect
    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: [
        'user-read-email',
        'user-read-private',
        'user-top-read',
        'user-read-currently-playing',
        'user-read-playback-state'
      ].join(' '),
      show_dialog: 'true',
      state: state,
    }).toString()}`;

    console.log('Generated Auth URL:', authUrl);
    return NextResponse.json({ authUrl, redirectUri });

  } catch (error) {
    console.error('Error generating Spotify auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}
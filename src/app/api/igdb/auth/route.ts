import { NextRequest, NextResponse } from 'next/server';

// IGDB API authentication via Twitch OAuth
export async function POST(request: NextRequest) {
  try {
    const clientId = 'n5fhh1vtpvj14kd6t9kl1k15n8t4tf';
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    if (!clientSecret) {
      return NextResponse.json(
        { error: 'IGDB client secret not configured' },
        { status: 500 }
      );
    }

    // Get OAuth token from Twitch
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Twitch OAuth error:', error);
      return NextResponse.json(
        { error: 'Failed to authenticate with Twitch' },
        { status: 401 }
      );
    }

    const tokenData = await tokenResponse.json();
    
    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
    });

  } catch (error) {
    console.error('IGDB auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
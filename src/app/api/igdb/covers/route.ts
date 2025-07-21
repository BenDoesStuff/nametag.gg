import { NextRequest, NextResponse } from 'next/server';

// Cache for storing access tokens
let cachedToken: {
  access_token: string;
  expires_at: number;
} | null = null;

async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  const clientId = 'n5fhh1vtpvj14kd6t9kl1k15n8t4tf';
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error('IGDB client secret not configured');
  }

  // Get new OAuth token from Twitch
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
    throw new Error('Failed to authenticate with Twitch');
  }

  const tokenData = await tokenResponse.json();
  
  // Cache the token (expires 5 minutes before actual expiry for safety)
  cachedToken = {
    access_token: tokenData.access_token,
    expires_at: Date.now() + (tokenData.expires_in - 300) * 1000,
  };

  return tokenData.access_token;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameName = searchParams.get('name');
    const gameId = searchParams.get('id');

    if (!gameName && !gameId) {
      return NextResponse.json(
        { error: 'Game name or ID is required' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();
    const clientId = 'n5fhh1vtpvj14kd6t9kl1k15n8t4tf';

    let queryBody = '';
    if (gameId) {
      // Search by specific IGDB ID
      queryBody = `fields name,cover.url,cover.image_id; where id = ${gameId};`;
    } else {
      // Search by name
      queryBody = `fields name,cover.url,cover.image_id; search "${gameName}"; limit 5;`;
    }

    // Search for the game
    const gameResponse = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: queryBody,
    });

    if (!gameResponse.ok) {
      const error = await gameResponse.text();
      console.error('IGDB API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch game data from IGDB' },
        { status: 500 }
      );
    }

    const games = await gameResponse.json();
    
    if (games.length === 0) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    let game;
    if (gameId) {
      // Direct ID lookup
      game = games[0];
    } else {
      // For name search, try to find the best match
      game = games.find(g => g.name.toLowerCase() === gameName.toLowerCase()) || games[0];
    }

    let coverUrl = null;

    // If the game has a cover, construct the full URL
    if (game.cover && game.cover.image_id) {
      // IGDB image URLs use this format for cover art
      coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${game.cover.image_id}.jpg`;
    }

    return NextResponse.json({
      name: game.name,
      cover_url: coverUrl,
      igdb_id: game.id,
      search_results: gameId ? undefined : games.length, // Show how many results for debugging
    });

  } catch (error) {
    console.error('IGDB covers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
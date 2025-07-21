/**
 * Spotify Web API integration for Nametag
 * Handles OAuth, token refresh, and API calls
 */

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
  popularity: number;
}

export interface SpotifyCurrentlyPlaying {
  item: SpotifyTrack | null;
  is_playing: boolean;
  progress_ms: number | null;
  timestamp: number;
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
}

export interface SpotifyProfile {
  id: string;
  display_name: string | null;
  email: string;
  images: Array<{ url: string; height: number; width: number }>;
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

// Spotify Web API configuration
export const SPOTIFY_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/spotify/link',
  scopes: [
    'user-read-email',
    'user-read-private',
    'user-top-read',
    'user-read-currently-playing',
    'user-read-playback-state'
  ].join(' '),
  baseUrl: 'https://api.spotify.com/v1',
  authUrl: 'https://accounts.spotify.com',
};

/**
 * Generate Spotify OAuth authorization URL
 */
export function getSpotifyAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    scope: SPOTIFY_CONFIG.scopes,
    show_dialog: 'true', // Force user to see consent screen
    ...(state && { state }),
  });

  return `${SPOTIFY_CONFIG.authUrl}/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
  const response = await fetch(`${SPOTIFY_CONFIG.authUrl}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }

  return response.json();
}

/**
 * Refresh Spotify access token
 */
export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyTokens> {
  const response = await fetch(`${SPOTIFY_CONFIG.authUrl}/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const tokens = await response.json();
  
  // Preserve the refresh token if not provided in response
  if (!tokens.refresh_token) {
    tokens.refresh_token = refreshToken;
  }

  return tokens;
}

/**
 * Make authenticated request to Spotify API
 */
export async function spotifyApiRequest<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_CONFIG.baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('SPOTIFY_TOKEN_EXPIRED');
    }
    if (response.status === 429) {
      throw new Error('SPOTIFY_RATE_LIMITED');
    }
    if (response.status === 204) {
      // No content - currently not playing anything
      return null as T;
    }
    
    const error = await response.text();
    throw new Error(`Spotify API error: ${response.status} ${error}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

/**
 * Get user's Spotify profile
 */
export async function getSpotifyProfile(accessToken: string): Promise<SpotifyProfile> {
  return spotifyApiRequest<SpotifyProfile>('/me', accessToken);
}

/**
 * Get user's top tracks
 */
export async function getTopTracks(
  accessToken: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'short_term',
  limit: number = 10
): Promise<SpotifyTopTracksResponse> {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: limit.toString(),
    offset: '0',
  });

  return spotifyApiRequest<SpotifyTopTracksResponse>(
    `/me/top/tracks?${params.toString()}`,
    accessToken
  );
}

/**
 * Get user's currently playing track
 */
export async function getCurrentlyPlaying(accessToken: string): Promise<SpotifyCurrentlyPlaying | null> {
  try {
    return await spotifyApiRequest<SpotifyCurrentlyPlaying>(
      '/me/player/currently-playing',
      accessToken
    );
  } catch (error) {
    if ((error as Error).message.includes('204')) {
      return null; // Nothing currently playing
    }
    throw error;
  }
}

/**
 * Helper to get album art URL with fallback sizes
 */
export function getAlbumArtUrl(
  images: Array<{ url: string; height: number; width: number }>,
  preferredSize: 'small' | 'medium' | 'large' = 'medium'
): string | null {
  if (!images || images.length === 0) return null;

  // Sort by size (largest first)
  const sortedImages = [...images].sort((a, b) => (b.height || 0) - (a.height || 0));

  switch (preferredSize) {
    case 'small':
      return sortedImages[sortedImages.length - 1]?.url || null;
    case 'large':
      return sortedImages[0]?.url || null;
    case 'medium':
    default:
      return sortedImages[Math.floor(sortedImages.length / 2)]?.url || sortedImages[0]?.url || null;
  }
}

/**
 * Format track duration from milliseconds to MM:SS
 */
export function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Validate Spotify configuration
 */
export function validateSpotifyConfig(): void {
  if (!SPOTIFY_CONFIG.clientId) {
    throw new Error('NEXT_PUBLIC_SPOTIFY_CLIENT_ID is required');
  }
  if (!SPOTIFY_CONFIG.clientSecret) {
    throw new Error('SPOTIFY_CLIENT_SECRET is required');
  }
}
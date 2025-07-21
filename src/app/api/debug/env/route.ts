import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    spotify_client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'NOT SET',
    spotify_redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'NOT SET',
    site_url: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
  });
}
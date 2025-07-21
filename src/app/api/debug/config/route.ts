import { NextResponse } from 'next/server';
import nextConfig from '../../../../../next.config';

export async function GET() {
  return NextResponse.json({
    images: nextConfig.images,
    spotifyHostname: nextConfig.images?.remotePatterns?.find(pattern => pattern.hostname === 'i.scdn.co')
  });
}
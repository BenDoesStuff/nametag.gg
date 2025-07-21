import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const channel = searchParams.get('channel');

  if (!platform || !channel) {
    return NextResponse.json(
      { error: 'Platform and channel parameters are required' },
      { status: 400 }
    );
  }

  try {
    // Note: This is a mock implementation for demonstration purposes
    // In a real implementation, you would:
    // 1. Set up proper API keys for Twitch/YouTube APIs
    // 2. Implement actual API calls to check stream status
    // 3. Handle rate limiting and caching
    // 4. Store API keys securely in environment variables

    // Mock response - always return offline for demo
    const mockStreamInfo = {
      isLive: false,
      title: null,
      thumbnail: null,
      viewerCount: 0,
      startedAt: null
    };

    // Uncomment and implement these sections when you have proper API access:

    /*
    if (platform === 'twitch') {
      // Twitch API implementation
      const twitchClientId = process.env.TWITCH_CLIENT_ID;
      const twitchAccessToken = process.env.TWITCH_ACCESS_TOKEN;
      
      if (!twitchClientId || !twitchAccessToken) {
        throw new Error('Twitch API credentials not configured');
      }

      const response = await fetch(
        `https://api.twitch.tv/helix/streams?user_login=${channel}`,
        {
          headers: {
            'Client-ID': twitchClientId,
            'Authorization': `Bearer ${twitchAccessToken}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const stream = data.data[0];
        return NextResponse.json({
          isLive: true,
          title: stream.title,
          thumbnail: stream.thumbnail_url.replace('{width}x{height}', '320x180'),
          viewerCount: stream.viewer_count,
          startedAt: stream.started_at
        });
      }
    }

    if (platform === 'youtube') {
      // YouTube API implementation
      const youtubeApiKey = process.env.YOUTUBE_API_KEY;
      
      if (!youtubeApiKey) {
        throw new Error('YouTube API key not configured');
      }

      // First, get the channel ID from the channel name
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${channel}&key=${youtubeApiKey}`
      );
      
      const channelData = await channelResponse.json();
      
      if (channelData.items && channelData.items.length > 0) {
        const channelId = channelData.items[0].id;
        
        // Check for live streams
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${youtubeApiKey}`
        );
        
        const searchData = await searchResponse.json();
        
        if (searchData.items && searchData.items.length > 0) {
          const liveStream = searchData.items[0];
          return NextResponse.json({
            isLive: true,
            title: liveStream.snippet.title,
            thumbnail: liveStream.snippet.thumbnails.medium.url,
            viewerCount: null, // YouTube doesn't provide live viewer count in search API
            startedAt: liveStream.snippet.publishedAt
          });
        }
      }
    }
    */

    return NextResponse.json(mockStreamInfo);

  } catch (error) {
    console.error('Stream status API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stream status',
        isLive: false 
      },
      { status: 500 }
    );
  }
}
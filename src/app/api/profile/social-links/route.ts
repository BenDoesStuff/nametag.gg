import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/profile/social-links - Get user's social links
export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('social_links')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Failed to fetch social links:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch social links' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      social_links: profile?.social_links || {}
    });

  } catch (error) {
    console.error('Social links API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/profile/social-links - Add or update a social link
export async function POST(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { platform, value } = body;

    // Validate input
    if (!platform || typeof platform !== 'string') {
      return NextResponse.json(
        { error: 'Platform is required and must be a string' },
        { status: 400 }
      );
    }

    if (!value || typeof value !== 'string') {
      return NextResponse.json(
        { error: 'Value is required and must be a string' },
        { status: 400 }
      );
    }

    // Trim whitespace and validate platform
    const trimmedPlatform = platform.toLowerCase().trim();
    const trimmedValue = value.trim();

    const validPlatforms = [
      'discord', 'steam', 'xbox', 'playstation', 'riot', 'epic',
      'github', 'twitch', 'youtube', 'twitter', 'instagram', 'tiktok'
    ];

    if (!validPlatforms.includes(trimmedPlatform)) {
      return NextResponse.json(
        { error: `Invalid platform. Supported platforms: ${validPlatforms.join(', ')}` },
        { status: 400 }
      );
    }

    if (trimmedValue.length === 0) {
      return NextResponse.json(
        { error: 'Value cannot be empty' },
        { status: 400 }
      );
    }

    if (trimmedValue.length > 255) {
      return NextResponse.json(
        { error: 'Value must be 255 characters or less' },
        { status: 400 }
      );
    }

    // Get current social links
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('social_links')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error('Failed to fetch current profile:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch current profile' },
        { status: 500 }
      );
    }

    // Update social links
    const currentLinks = profile?.social_links || {};
    const updatedLinks = {
      ...currentLinks,
      [trimmedPlatform]: trimmedValue
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ social_links: updatedLinks })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update social links:', updateError);
      return NextResponse.json(
        { error: 'Failed to update social links' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Social link updated successfully',
      social_links: updatedLinks
    });

  } catch (error) {
    console.error('Social links POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/profile/social-links - Remove a social link
export async function DELETE(request: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { platform } = body;

    // Validate input
    if (!platform || typeof platform !== 'string') {
      return NextResponse.json(
        { error: 'Platform is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedPlatform = platform.toLowerCase().trim();

    // Get current social links
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('social_links')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      console.error('Failed to fetch current profile:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch current profile' },
        { status: 500 }
      );
    }

    // Remove the platform from social links
    const currentLinks = profile?.social_links || {};
    const updatedLinks = { ...currentLinks };
    delete updatedLinks[trimmedPlatform];

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ social_links: updatedLinks })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update social links:', updateError);
      return NextResponse.json(
        { error: 'Failed to update social links' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Social link removed successfully',
      social_links: updatedLinks
    });

  } catch (error) {
    console.error('Social links DELETE API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
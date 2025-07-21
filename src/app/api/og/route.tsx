/**
 * Dynamic Open Graph Image Generation
 * Generates OG images for profiles and pages using @vercel/og
 */

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Fonts for the OG image
const interRegular = fetch(
  new URL('../../../assets/fonts/Inter-Regular.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
  new URL('../../../assets/fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters
    const title = searchParams.get('title') || 'Nametag';
    const subtitle = searchParams.get('subtitle') || 'Your Ultimate Gamer Profile';
    const username = searchParams.get('username');
    const type = searchParams.get('type') || 'default';
    const theme = searchParams.get('theme') || 'green';
    
    // Load fonts
    const [regularFont, boldFont] = await Promise.all([
      interRegular,
      interBold,
    ]);
    
    // Theme colors
    const themes = {
      green: {
        primary: '#00ff41',
        bg: '#0a0a0a',
        text: '#ffffff',
        accent: '#1a1a1a',
      },
      blue: {
        primary: '#0084ff',
        bg: '#0a0a0a',
        text: '#ffffff',
        accent: '#1a1a1a',
      },
      purple: {
        primary: '#8b5cf6',
        bg: '#0a0a0a',
        text: '#ffffff',
        accent: '#1a1a1a',
      },
    };
    
    const currentTheme = themes[theme as keyof typeof themes] || themes.green;
    
    // Generate different layouts based on type
    if (type === 'profile' && username) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: currentTheme.bg,
              backgroundImage: `radial-gradient(circle at 25% 25%, ${currentTheme.primary}22 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${currentTheme.primary}22 0%, transparent 50%)`,
            }}
          >
            {/* Nametag logo/icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: currentTheme.primary,
                  borderRadius: 8,
                  marginRight: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                }}
              >
                🏷️
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: currentTheme.primary,
                  fontFamily: 'Inter Bold',
                }}
              >
                Nametag
              </div>
            </div>
            
            {/* Username */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: currentTheme.text,
                fontFamily: 'Inter Bold',
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              @{username}
            </div>
            
            {/* Subtitle */}
            <div
              style={{
                fontSize: 32,
                color: currentTheme.text,
                opacity: 0.8,
                fontFamily: 'Inter Regular',
                textAlign: 'center',
                maxWidth: 800,
              }}
            >
              {subtitle}
            </div>
            
            {/* Gaming elements */}
            <div
              style={{
                display: 'flex',
                marginTop: 60,
                gap: 20,
              }}
            >
              <div
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentTheme.accent,
                  border: `2px solid ${currentTheme.primary}`,
                  borderRadius: 8,
                  color: currentTheme.text,
                  fontSize: 20,
                  fontFamily: 'Inter Regular',
                }}
              >
                🎮 Gamer Profile
              </div>
              <div
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentTheme.accent,
                  border: `2px solid ${currentTheme.primary}`,
                  borderRadius: 8,
                  color: currentTheme.text,
                  fontSize: 20,
                  fontFamily: 'Inter Regular',
                }}
              >
                🏆 Achievements
              </div>
              <div
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentTheme.accent,
                  border: `2px solid ${currentTheme.primary}`,
                  borderRadius: 8,
                  color: currentTheme.text,
                  fontSize: 20,
                  fontFamily: 'Inter Regular',
                }}
              >
                👥 Friends
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: 'Inter Regular',
              data: regularFont,
              style: 'normal',
              weight: 400,
            },
            {
              name: 'Inter Bold',
              data: boldFont,
              style: 'normal',
              weight: 700,
            },
          ],
        }
      );
    }
    
    // Default layout for pages
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTheme.bg,
            backgroundImage: `radial-gradient(circle at 25% 25%, ${currentTheme.primary}22 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${currentTheme.primary}22 0%, transparent 50%)`,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 60,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                backgroundColor: currentTheme.primary,
                borderRadius: 12,
                marginRight: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
              }}
            >
              🏷️
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: currentTheme.primary,
                fontFamily: 'Inter Bold',
              }}
            >
              Nametag
            </div>
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: currentTheme.text,
              fontFamily: 'Inter Bold',
              textAlign: 'center',
              marginBottom: 30,
              maxWidth: 1000,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: currentTheme.text,
              opacity: 0.8,
              fontFamily: 'Inter Regular',
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            {subtitle}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter Regular',
            data: regularFont,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter Bold',
            data: boldFont,
            style: 'normal',
            weight: 700,
          },
        ],
      }
    );
  } catch (e: any) {
    console.error('OG image generation failed:', e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
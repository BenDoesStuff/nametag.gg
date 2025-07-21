/**
 * Connect Spotify Button Component
 * Handles Spotify OAuth connection flow
 */

'use client';

import { useState } from 'react';
import { Music } from 'lucide-react';

interface ConnectSpotifyButtonProps {
  /** Redirect URL after successful connection */
  redirectTo?: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'minimal';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show Spotify logo */
  showLogo?: boolean;
  /** Custom button text */
  text?: string;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Success callback */
  onSuccess?: () => void;
  /** Error callback */
  onError?: (error: string) => void;
}

export function ConnectSpotifyButton({
  redirectTo,
  variant = 'primary',
  size = 'md',
  showLogo = true,
  text = 'Connect Spotify',
  loading: externalLoading = false,
  disabled = false,
  className = '',
  onSuccess,
  onError,
}: ConnectSpotifyButtonProps) {
  const [loading, setLoading] = useState(false);

  const isLoading = loading || externalLoading;

  const handleConnect = async () => {
    if (isLoading || disabled) return;

    try {
      setLoading(true);

      // Request OAuth URL from our API
      const response = await fetch('/api/spotify/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirect: redirectTo || window.location.pathname,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect to Spotify');
      }

      const { authUrl } = await response.json();
      
      // Redirect to Spotify OAuth
      window.location.href = authUrl;

    } catch (error) {
      console.error('Spotify connection error:', error);
      const message = error instanceof Error ? error.message : 'Failed to connect to Spotify';
      
      if (onError) {
        onError(message);
      } else {
        // Show error in a simple alert if no error handler provided
        alert(`Error: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Variant styles
  const variantStyles = {
    primary: 'bg-[#1DB954] hover:bg-[#1ed760] text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600',
    minimal: 'bg-transparent hover:bg-gray-800/20 text-gray-300 border border-gray-600',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Spotify logo SVG
  const SpotifyLogo = () => (
    <svg
      className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center justify-center gap-2 
        rounded-lg font-medium transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div className={`animate-spin rounded-full border-2 border-transparent border-t-current ${
            size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
          }`} />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          {showLogo ? <SpotifyLogo /> : <Music className={`${
            size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
          }`} />}
          <span>{text}</span>
        </>
      )}
    </button>
  );
}

/**
 * Compact version for use in settings or profile edit
 */
export function CompactConnectSpotifyButton(props: Omit<ConnectSpotifyButtonProps, 'variant' | 'size'>) {
  return (
    <ConnectSpotifyButton
      {...props}
      variant="secondary"
      size="sm"
      text={props.text || 'Connect'}
    />
  );
}

/**
 * Large promotional version for onboarding or feature discovery
 */
export function PromoConnectSpotifyButton(props: Omit<ConnectSpotifyButtonProps, 'variant' | 'size'>) {
  return (
    <div className="text-center">
      <ConnectSpotifyButton
        {...props}
        variant="primary"
        size="lg"
        text={props.text || 'Connect Your Spotify Account'}
      />
      <p className="mt-2 text-sm text-gray-400">
        Show your music taste and currently playing tracks
      </p>
    </div>
  );
}
/**
 * Sentry client-side configuration for Nametag
 * This file configures error monitoring for client-side errors
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Capture 100% of the transactions in development, 10% in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture 100% of the replay sessions in development, 10% in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture 100% of the replay sessions when an error occurs
  replaysOnErrorSampleRate: 1.0,
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release information
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  // Filter out common non-critical errors
  beforeSend(event, hint) {
    // Filter out common browser extension errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && error instanceof Error) {
        // Skip extension-related errors
        if (error.message?.includes('Non-Error promise rejection')) {
          return null;
        }
        if (error.message?.includes('ResizeObserver loop limit exceeded')) {
          return null;
        }
        if (error.message?.includes('Script error')) {
          return null;
        }
      }
    }
    
    return event;
  },
  
  // Additional integrations
  integrations: [
    new Sentry.Replay({
      // Mask all text content, but record user interactions
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Custom tags for filtering
  initialScope: {
    tags: {
      component: 'client',
      platform: 'web',
    },
  },
  
  // Performance monitoring
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
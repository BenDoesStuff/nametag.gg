/**
 * Sentry server-side configuration for Nametag
 * This file configures error monitoring for server-side errors
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Capture 100% of the transactions in development, 5% in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release information
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Filter out non-critical server errors
  beforeSend(event, hint) {
    // Don't log expected API errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && error instanceof Error) {
        // Skip Supabase auth errors (these are usually expected)
        if (error.message?.includes('JWT')) {
          return null;
        }
        if (error.message?.includes('Auth session missing')) {
          return null;
        }
        // Skip rate limiting errors
        if (error.message?.includes('Rate limit')) {
          return null;
        }
      }
    }
    
    return event;
  },
  
  // Custom tags for filtering
  initialScope: {
    tags: {
      component: 'server',
      runtime: 'nodejs',
    },
  },
  
  // Performance monitoring for server
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture console logs as breadcrumbs
  integrations: [
    new Sentry.Integrations.Console({
      levels: ['error', 'warn'],
    }),
  ],
});
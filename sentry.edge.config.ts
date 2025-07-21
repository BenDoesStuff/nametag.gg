/**
 * Sentry Edge Runtime configuration for Nametag
 * This file configures error monitoring for Edge Runtime functions
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Lower sampling rate for edge functions to avoid quota issues
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release information
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Custom tags for filtering
  initialScope: {
    tags: {
      component: 'edge',
      runtime: 'edge',
    },
  },
});
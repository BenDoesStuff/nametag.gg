/**
 * Analytics and tracking setup for Nametag
 * Supports Plausible Analytics and Vercel Analytics
 */

import Plausible from 'plausible-tracker';

// Initialize Plausible tracker
const plausible = Plausible({
  domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'nametag.gg',
  trackLocalhost: false,
  apiHost: 'https://plausible.io',
});

// Custom event types for type safety
export type AnalyticsEvent = 
  | { name: 'profile_view'; props: { username: string } }
  | { name: 'profile_edit'; props: { block_type: string } }
  | { name: 'friend_request_sent'; props: { target_user: string } }
  | { name: 'game_added'; props: { game_name: string } }
  | { name: 'theme_changed'; props: { theme_name: string } }
  | { name: 'signup_completed'; props: { method: string } }
  | { name: 'block_added'; props: { block_type: string } }
  | { name: 'social_link_added'; props: { platform: string } };

/**
 * Track custom events with Plausible
 */
export function trackEvent(event: AnalyticsEvent) {
  // Only track in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
    plausible.trackEvent(event.name, { props: event.props });
  }
}

/**
 * Track page views (usually automatic, but can be called manually for SPA navigation)
 */
export function trackPageView(url?: string) {
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
    plausible.trackPageview({
      url: url || window.location.href,
    });
  }
}

/**
 * Initialize analytics on app start
 */
export function initAnalytics() {
  // Enable auto-tracking of page views
  if (typeof window !== 'undefined') {
    plausible.enableAutoPageviews();
    
    // Track initial page view
    trackPageView();
    
    console.log('Analytics initialized');
  }
}

/**
 * Utility to check if analytics should be active
 */
export function isAnalyticsEnabled(): boolean {
  return process.env.NODE_ENV === 'production' || 
         process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
}
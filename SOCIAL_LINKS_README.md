# Social Links / Connected Accounts Feature

## Overview

The Social Links feature allows users to connect their gaming and social platform accounts to their Nametag profile. Users can add, edit, and display links for popular gaming and social platforms.

## Architecture

### Database Design

**Option A - JSON Column (Implemented)**
- Added `social_links` JSONB column to the existing `profiles` table
- Keys are platform slugs (`discord`, `steam`, etc.), values are strings
- Includes GIN index for efficient querying
- Validates that social_links is always a valid JSON object

```sql
-- Migration: database/add_social_links.sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_profiles_social_links 
ON profiles USING gin(social_links);
```

### API Layer

**RESTful API Routes** (`/api/profile/social-links`)
- `GET` - Retrieve user's social links
- `POST` - Add or update a social link
- `DELETE` - Remove a social link

Features:
- Authentication required for all operations
- Input validation and sanitization
- Platform whitelist validation
- Auto-formatting for common platforms

### Frontend Components

1. **PlatformIcon** (`src/components/PlatformIcon.tsx`)
   - SVG icons for all supported platforms
   - Responsive sizing with className support
   - Fallback generic link icon for unknown platforms

2. **SocialLinkForm** (`src/components/SocialLinkForm.tsx`)
   - Platform selection dropdown
   - Dynamic input placeholders based on platform
   - Real-time validation and auto-formatting
   - Success/error feedback

3. **SocialLinkList** (`src/components/SocialLinkList.tsx`)
   - Display connected accounts with platform icons
   - Edit mode: remove buttons and visit links
   - View mode: clickable external links
   - Empty state with helpful messaging

4. **useSocialLinks** Hook (`src/hooks/useSocialLinks.ts`)
   - Data fetching and state management
   - CRUD operations with error handling
   - Auto-formatting utilities
   - Platform validation helpers

## Supported Platforms

| Platform | Key | Expected Format | Auto-Format |
|----------|-----|-----------------|-------------|
| Discord | `discord` | username#1234 or invite link | ✗ |
| Steam | `steam` | Steam ID or profile URL | ✓ |
| Xbox Live | `xbox` | Gamertag | ✗ |
| PlayStation | `playstation` | PSN ID | ✗ |
| Riot Games | `riot` | username#TAG | ✗ |
| Epic Games | `epic` | Epic username | ✗ |
| GitHub | `github` | Username | ✓ |
| Twitch | `twitch` | Username | ✓ |
| YouTube | `youtube` | Channel URL or @handle | ✓ |
| Twitter/X | `twitter` | Username (@ optional) | ✓ |
| Instagram | `instagram` | Username (@ optional) | ✓ |
| TikTok | `tiktok` | Username (@ optional) | ✓ |

## Adding New Platforms

### 1. Add Platform to Constants

Update `src/hooks/useSocialLinks.ts`:

```typescript
export const SUPPORTED_PLATFORMS = [
  // ... existing platforms
  'newplatform'
] as const;

export const PLATFORM_LABELS: Record<SupportedPlatform, string> = {
  // ... existing labels
  newplatform: 'New Platform'
};

export const PLATFORM_PLACEHOLDERS: Record<SupportedPlatform, string> = {
  // ... existing placeholders
  newplatform: 'Enter your New Platform username'
};
```

### 2. Add Platform Icon

Update `src/components/PlatformIcon.tsx`:

```typescript
switch (platform.toLowerCase()) {
  // ... existing cases
  case 'newplatform':
    return (
      <svg {...iconProps}>
        {/* SVG path for new platform icon */}
      </svg>
    );
}
```

### 3. Add URL Generation (Optional)

Update `getPlatformUrl` function in `src/hooks/useSocialLinks.ts`:

```typescript
export function getPlatformUrl(platform: SupportedPlatform, value: string): string {
  switch (platform) {
    // ... existing cases
    case 'newplatform':
      return `https://newplatform.com/user/${value}`;
    default:
      return value;
  }
}
```

### 4. Add Auto-Formatting (Optional)

Update `formatSocialLink` function in `src/hooks/useSocialLinks.ts`:

```typescript
export function formatSocialLink(platform: SupportedPlatform, value: string): string {
  switch (platform) {
    // ... existing cases
    case 'newplatform':
      // Custom formatting logic
      return value.toLowerCase().trim();
    default:
      return value.trim();
  }
}
```

## Integration Points

### Edit Profile Page
- **Location**: `src/app/profile/edit/page.tsx`
- **Features**: Two-column layout with profile info and social links management
- **Components**: SocialLinkForm + SocialLinkList in editable mode

### Public Profile View
- **Location**: `src/app/[username]/page.tsx`
- **Features**: Connected accounts section with clickable platform links
- **Display**: Responsive grid of platform buttons with hover effects

## Security & Validation

### Input Validation
- Platform whitelist validation
- Maximum length limits (255 characters)
- XSS prevention through input sanitization
- SQL injection prevention via parameterized queries

### Authentication
- All API routes require authentication
- RLS policies ensure users can only modify their own social links
- Client-side hooks validate user session

### Data Privacy
- Social links are publicly visible on profile pages
- No sensitive data (passwords, tokens) is stored
- External links open in new tabs with `noopener noreferrer`

## User Experience

### Auto-Formatting
- Steam: Prepends community URL for usernames
- GitHub: Prepends GitHub URL for usernames  
- Social platforms: Removes @ symbols where appropriate
- URLs: Validates and formats properly

### Visual Feedback
- Success toasts on add/update/remove
- Loading states during operations
- Error messages with specific guidance
- Empty states with helpful instructions

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-friendly button sizes
- Optimized layouts for mobile editing
- Horizontal scrolling for platform lists

## Performance Considerations

### Database
- JSONB column with GIN index for efficient queries
- Single table design minimizes JOINs
- Optimized for read-heavy workloads

### Frontend
- Efficient re-renders with proper React hooks
- Optimistic updates for better UX
- Lazy loading of icons where possible
- Minimal API calls with proper caching

## Future Enhancements

### OAuth Integration
- Real account verification via OAuth
- Automatic profile data fetching
- Account status validation

### Advanced Features
- Platform-specific data display (follower counts, achievements)
- Social activity feeds
- Cross-platform friend finding
- Gaming statistics integration

### Analytics
- Track popular platforms
- Connection success rates
- User engagement metrics

## Testing

### Manual Testing Checklist
- [ ] Add social link for each platform
- [ ] Edit existing social links
- [ ] Remove social links
- [ ] Verify external links work correctly
- [ ] Test auto-formatting for URLs
- [ ] Check mobile responsiveness
- [ ] Validate error handling
- [ ] Test empty states

### API Testing
```bash
# Add a social link
curl -X POST /api/profile/social-links \
  -H "Content-Type: application/json" \
  -d '{"platform": "github", "value": "username"}'

# Remove a social link  
curl -X DELETE /api/profile/social-links \
  -H "Content-Type: application/json" \
  -d '{"platform": "github"}'
```

## Troubleshooting

### Common Issues

**Social links not displaying**
- Check if user is authenticated
- Verify social_links column exists in database
- Ensure data is properly formatted JSON

**Auto-formatting not working**
- Check platform is in SUPPORTED_PLATFORMS array
- Verify formatSocialLink function has correct case
- Ensure input validation passes

**API errors**
- Verify authentication headers
- Check platform whitelist validation
- Validate input length limits

**Icons not loading**
- Ensure PlatformIcon component has case for platform
- Check SVG syntax is valid
- Verify icon imports are correct
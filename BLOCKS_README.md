# Nametag Block System - New Blocks Guide

This document explains the four new block types added to the Nametag profile platform and how to extend the block system further.

## New Block Types

### 1. About Me Block (`about`)

Personal bio and background information with two variants:

- **Rich Text Variant** (`richText`): Supports full Markdown formatting including headers, lists, links, code blocks, and emphasis
- **Q&A Cards Variant** (`qa`): Displays predefined questions and answers in an organized card layout

**Data Storage**: Stored in `profiles` table columns:
- `about_text` (text): Markdown content for rich text variant
- `about_qa` (jsonb): Array of question/answer objects for Q&A variant

**Usage Example**:
```typescript
const aboutBlock: ProfileBlock = {
  id: 'about-1',
  type: 'about',
  variant: 'richText' // or 'qa'
};
```

### 2. Latest Stream Block (`stream`)

Twitch/YouTube stream integration with two variants:

- **Large Player Variant** (`player`): Full-size embedded stream player with title and channel link
- **Thumbnail Variant** (`thumbnail`): Compact view with thumbnail and watch button

**Data Storage**: Stored in `profiles` table columns:
- `stream_platform` (text): 'twitch' or 'youtube'
- `stream_channel` (text): Channel username/handle
- `stream_last_title` (text): Last stream title
- `stream_last_thumbnail` (text): Last stream thumbnail URL

**API Integration**: Uses `/api/stream-status` endpoint to check live status (requires API keys)

### 3. Team Roster Block (`roster`)

E-sports team members and roles with two variants:

- **Avatar Grid Variant** (`grid`): 5-player avatar grid with roles and hover effects
- **Detailed List Variant** (`list`): Scrollable list with join dates and social links

**Data Storage**: Uses `profile_team` table with columns:
- `member_name` (text): Team member's name
- `role` (text): Player role (e.g., "Support", "DPS")
- `avatar_url` (text): Member's avatar image
- `social_links` (jsonb): Social platform links
- `joined_at` (timestamp): When they joined the team
- `display_order` (integer): Custom ordering

### 4. Media Gallery Block (`gallery`)

Photos and screenshots showcase with two variants:

- **Masonry Grid Variant** (`masonry`): CSS columns-based masonry layout with lightbox
- **3-Image Carousel Variant** (`carousel`): Swiper.js carousel with navigation and pagination

**Data Storage**: Uses `profile_media` table with columns:
- `url` (text): Image URL (stored in Supabase Storage)
- `caption` (text): Optional image caption
- `display_order` (integer): Custom ordering

## Installation & Setup

### Required Packages

```bash
npm install react-markdown remark-gfm swiper
```

### Database Setup

1. Run the new blocks schema migration:
```sql
-- Execute /database/new_blocks_schema.sql
```

2. Configure Supabase Storage bucket for media uploads:
```sql
-- Create 'media' bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
```

### API Configuration (Optional)

For live stream status checking, add environment variables:

```env
# Twitch API (optional)
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_ACCESS_TOKEN=your_twitch_access_token

# YouTube API (optional)
YOUTUBE_API_KEY=your_youtube_api_key
```

## Extending the Block System

### Creating a New Block Type

1. **Create the Component**:
```typescript
// src/components/blocks/YourBlock.tsx
export function YourBlock({ block, profile, isEditing, onEdit, onDelete }: YourBlockProps) {
  // Component implementation
}

export const yourBlockVariants = [
  { id: 'variant1', name: 'Variant 1', description: 'Description' },
  { id: 'variant2', name: 'Variant 2', description: 'Description' }
];
```

2. **Register in BlockRenderer**:
```typescript
// src/components/blocks/BlockRenderer.tsx
import { YourBlock } from './YourBlock';

// Add case in renderBlock() switch statement
case 'yourblock':
  return <YourBlock block={block} profile={profile} isEditing={isEditing} onEdit={onEdit} onDelete={onDelete} />;
```

3. **Add Block Definition**:
```typescript
// src/lib/blockDefinitions.ts
{
  type: 'yourblock',
  name: 'Your Block',
  description: 'Block description',
  icon: '🎯',
  variants: yourBlockVariants,
  defaultVariant: 'variant1'
}
```

4. **Update Type Definitions**:
```typescript
// src/types/layout.ts
type: 'header' | 'friends' | 'games' | 'achievements' | 'accounts' | 'custom' | 'about' | 'stream' | 'roster' | 'gallery' | 'yourblock';
```

### Custom Hooks Pattern

Create data management hooks for complex blocks:

```typescript
// src/hooks/useYourData.ts
export function useYourData(profileId?: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch, add, update, remove, reorder functions
  
  return { data, loading, error, addItem, updateItem, removeItem };
}
```

## Theme Integration

All blocks automatically inherit theme colors via the `useTheme()` hook:

```typescript
const { themeClasses } = useTheme();

// Use theme classes in JSX
<div className={`${themeClasses.cardBg} ${themeClasses.textPrimary}`}>
  Content
</div>
```

Available theme classes:
- `cardBg`: Card background color
- `textPrimary`: Primary text color
- `textSecondary`: Secondary text color
- `accentBg`: Accent background color
- `accentBorder`: Accent border color
- `hoverAccent`: Hover effect class

## Best Practices

### Component Guidelines

1. **Always handle empty states** - Show placeholders when no data is available
2. **Implement loading states** - Use consistent loading spinners
3. **Support all variants** - Each block should handle all defined variants
4. **Follow responsive design** - Use Tailwind responsive classes (`sm:`, `lg:`)
5. **Add accessibility** - Include ARIA labels and keyboard navigation
6. **Error boundaries** - Gracefully handle API failures

### Performance Considerations

1. **Tree-shake imports** - Import only needed Swiper modules
2. **Image optimization** - Use Next.js Image component with proper sizing
3. **Lazy loading** - Load block data only when needed
4. **Debounce updates** - For real-time editing features
5. **Cache API responses** - Implement SWR or React Query for data fetching

### Security Guidelines

1. **Validate user inputs** - Sanitize Markdown and user-generated content
2. **Check permissions** - Verify user owns data before CRUD operations
3. **Rate limit APIs** - Prevent abuse of external API calls
4. **Secure file uploads** - Validate file types and sizes for media gallery
5. **Environment variables** - Never expose API keys in client code

## Bundle Size Impact

The new blocks add the following to the bundle:

- `react-markdown` + `remark-gfm`: ~45KB
- `swiper` (with tree-shaking): ~25KB
- New block components: ~15KB

Total addition: ~85KB (gzipped: ~30KB)

## Browser Support

- **Masonry Layout**: CSS Grid support required (IE11+)
- **Swiper Carousel**: Modern browsers (ES6+)
- **Markdown Rendering**: All browsers with React support
- **Image Optimization**: Next.js Image component requirements

## Migration Guide

If upgrading from a previous version:

1. Run database migrations for new tables
2. Update Next.js image configuration for new domains
3. Install new npm dependencies
4. Rebuild and test existing profiles
5. Update any custom block implementations

For questions or issues, refer to the main documentation or create an issue in the repository.
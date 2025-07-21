import { BlockDefinition, ProfileBlock } from '@/types/layout';

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'header',
    name: 'Profile Header',
    description: 'Avatar, banner, name, and bio',
    icon: '👤',
    variants: [
      {
        id: 'default',
        name: 'Standard',
        description: 'Classic header with banner overlay',
      }
    ],
    defaultVariant: 'default'
  },
  {
    type: 'friends',
    name: 'Friends',
    description: 'Display friends list',
    icon: '👥',
    variants: [
      {
        id: 'compactList',
        name: 'Compact List',
        description: 'Simple list with names and avatars',
      },
      {
        id: 'avatarGrid',
        name: 'Avatar Grid',
        description: 'Grid of friend avatars',
      },
      {
        id: 'featuredFriends',
        name: 'Featured Friends',
        description: 'Highlight top friends with stats',
      }
    ],
    defaultVariant: 'avatarGrid'
  },
  {
    type: 'games',
    name: 'Games I Play',
    description: 'Showcase your game collection',
    icon: '🎮',
    variants: [
      {
        id: 'coverSmall',
        name: 'Small Grid',
        description: 'Compact grid of game covers',
      },
      {
        id: 'coverLarge',
        name: 'Large Grid',
        description: 'Detailed grid with large covers',
      },
      {
        id: 'carousel',
        name: 'Horizontal Scroll',
        description: 'Scrollable carousel of games',
      },
      {
        id: 'showcase',
        name: 'Showcase',
        description: 'Featured games with descriptions',
      }
    ],
    defaultVariant: 'coverLarge'
  },
  {
    type: 'achievements',
    name: 'Achievements',
    description: 'Gaming achievements and trophies',
    icon: '🏆',
    variants: [
      {
        id: 'grid',
        name: 'Achievement Grid',
        description: 'Grid of achievement badges',
      },
      {
        id: 'featured',
        name: 'Featured',
        description: 'Highlight recent achievements',
      },
      {
        id: 'stats',
        name: 'Stats Overview',
        description: 'Achievement statistics',
      }
    ],
    defaultVariant: 'grid'
  },
  {
    type: 'accounts',
    name: 'Connected Accounts',
    description: 'Social media and gaming platforms',
    icon: '🔗',
    variants: [
      {
        id: 'grid',
        name: 'Icon Grid',
        description: 'Grid of platform icons',
      },
      {
        id: 'list',
        name: 'Detailed List',
        description: 'List with platform names',
      },
      {
        id: 'cards',
        name: 'Platform Cards',
        description: 'Card-based layout with stats',
      }
    ],
    defaultVariant: 'grid'
  },
  {
    type: 'about',
    name: 'About Me',
    description: 'Personal bio and background information',
    icon: '📝',
    variants: [
      {
        id: 'richText',
        name: 'Rich Text',
        description: 'Markdown-formatted paragraph with rich text support',
      },
      {
        id: 'qa',
        name: 'Q&A Cards',
        description: 'Question and answer format with card layout',
      }
    ],
    defaultVariant: 'richText'
  },
  {
    type: 'stream',
    name: 'Latest Stream',
    description: 'Twitch/YouTube stream integration',
    icon: '🎥',
    variants: [
      {
        id: 'player',
        name: 'Large Player',
        description: 'Full-size embedded stream player with title and channel link',
      },
      {
        id: 'thumbnail',
        name: 'Thumbnail',
        description: 'Compact view with thumbnail and watch button',
      }
    ],
    defaultVariant: 'player'
  },
  {
    type: 'roster',
    name: 'Team Roster',
    description: 'E-sports team members and roles',
    icon: '⚔️',
    variants: [
      {
        id: 'grid',
        name: 'Avatar Grid',
        description: '5-player avatar grid with roles and hover effects',
      },
      {
        id: 'list',
        name: 'Detailed List',
        description: 'Scrollable list with join dates and social links',
      }
    ],
    defaultVariant: 'grid'
  },
  {
    type: 'gallery',
    name: 'Media Gallery',
    description: 'Photos and screenshots showcase',
    icon: '🖼️',
    variants: [
      {
        id: 'masonry',
        name: 'Masonry Grid',
        description: 'CSS columns-based masonry layout with lightbox',
      },
      {
        id: 'carousel',
        name: '3-Image Carousel',
        description: 'Swiper.js carousel with navigation and pagination',
      }
    ],
    defaultVariant: 'masonry'
  },
  {
    type: 'spotify-tracks',
    name: 'Favorite Songs',
    description: 'Spotify favorite tracks and music taste',
    icon: '🎵',
    variants: [
      {
        id: 'grid',
        name: 'Album Grid',
        description: '5×2 grid of album artwork with hover details',
      },
      {
        id: 'list',
        name: 'Track List',
        description: 'Vertical list with track details and play buttons',
      }
    ],
    defaultVariant: 'grid'
  }
];

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return BLOCK_DEFINITIONS.find(def => def.type === type);
}

export function getDefaultLayout(): ProfileBlock[] {
  return [
    { id: 'header', type: 'header' },
    { id: 'friends', type: 'friends', variant: 'avatarGrid' },
    { id: 'games', type: 'games', variant: 'coverLarge' },
    { id: 'achievements', type: 'achievements', variant: 'grid' },
    { id: 'accounts', type: 'accounts', variant: 'grid' }
  ];
}

export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
// Games catalog for "Games I Play" feature
// Icons can be added to public/icons/games/ directory

export interface Game {
  slug: string;
  name: string;
  icon: string;
  poster?: string; // Cover art/poster image URL
  category?: string;
  platforms?: string[];
}

export const GAME_CATALOG: Game[] = [
  // FPS/Tactical Shooters
  {
    slug: 'valorant',
    name: 'Valorant',
    icon: '/icons/games/valorant.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co8ok7.jpg',
    category: 'FPS',
    platforms: ['PC']
  },
  {
    slug: 'counter-strike-2',
    name: 'Counter-Strike 2',
    icon: '/icons/games/cs2.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co92du.jpg',
    category: 'FPS',
    platforms: ['PC']
  },
  {
    slug: 'overwatch-2',
    name: 'Overwatch 2',
    icon: '/icons/games/overwatch.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co84ii.jpg',
    category: 'FPS',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'apex-legends',
    name: 'Apex Legends',
    icon: '/icons/games/apex.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1wzo.jpg',
    category: 'Battle Royale',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'call-of-duty-warzone',
    name: 'Call of Duty: Warzone',
    icon: '/icons/games/cod-warzone.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co5r6t.jpg',
    category: 'Battle Royale',
    platforms: ['PC', 'Console']
  },

  // Battle Royale
  {
    slug: 'fortnite',
    name: 'Fortnite',
    icon: '/icons/games/fortnite.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co89n1.jpg',
    category: 'Battle Royale',
    platforms: ['PC', 'Console', 'Mobile']
  },
  {
    slug: 'pubg',
    name: 'PUBG',
    icon: '/icons/games/pubg.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co7j43.jpg',
    category: 'Battle Royale',
    platforms: ['PC', 'Console', 'Mobile']
  },

  // MOBA
  {
    slug: 'league-of-legends',
    name: 'League of Legends',
    icon: '/icons/games/lol.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co49wj.jpg',
    category: 'MOBA',
    platforms: ['PC']
  },
  {
    slug: 'dota-2',
    name: 'Dota 2',
    icon: '/icons/games/dota2.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co6ene.jpg',
    category: 'MOBA',
    platforms: ['PC']
  },

  // MMO/RPG
  {
    slug: 'world-of-warcraft',
    name: 'World of Warcraft',
    icon: '/icons/games/wow.svg',
    poster: '/images/default-game-poster.svg',
    category: 'MMORPG',
    platforms: ['PC']
  },
  {
    slug: 'final-fantasy-xiv',
    name: 'Final Fantasy XIV',
    icon: '/icons/games/ffxiv.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co48rz.jpg',
    category: 'MMORPG',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'lost-ark',
    name: 'Lost Ark',
    icon: '/icons/games/lost-ark.svg',
    poster: '/images/default-game-poster.svg',
    category: 'MMORPG',
    platforms: ['PC']
  },
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    icon: '/icons/games/genshin.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co7u0c.jpg',
    category: 'RPG',
    platforms: ['PC', 'Console', 'Mobile']
  },

  // Sandbox/Survival
  {
    slug: 'minecraft',
    name: 'Minecraft',
    icon: '/icons/games/minecraft.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co8fu7.jpg',
    category: 'Sandbox',
    platforms: ['PC', 'Console', 'Mobile']
  },
  {
    slug: 'rust',
    name: 'Rust',
    icon: '/icons/games/rust.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co84xi.jpg',
    category: 'Survival',
    platforms: ['PC']
  },
  {
    slug: 'valheim',
    name: 'Valheim',
    icon: '/icons/games/valheim.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2x61.jpg',
    category: 'Survival',
    platforms: ['PC']
  },

  // Racing
  {
    slug: 'rocket-league',
    name: 'Rocket League',
    icon: '/icons/games/rocket-league.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co5w0w.jpg',
    category: 'Sports',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'gran-turismo-7',
    name: 'Gran Turismo 7',
    icon: '/icons/games/gt7.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Racing',
    platforms: ['Console']
  },

  // Strategy
  {
    slug: 'starcraft-2',
    name: 'StarCraft 2',
    icon: '/icons/games/sc2.svg',
    poster: '/images/default-game-poster.svg',
    category: 'RTS',
    platforms: ['PC']
  },
  {
    slug: 'age-of-empires-4',
    name: 'Age of Empires IV',
    icon: '/icons/games/aoe4.svg',
    poster: '/images/default-game-poster.svg',
    category: 'RTS',
    platforms: ['PC']
  },

  // Simulation
  {
    slug: 'cities-skylines',
    name: 'Cities: Skylines',
    icon: '/icons/games/cities-skylines.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Simulation',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'sims-4',
    name: 'The Sims 4',
    icon: '/icons/games/sims4.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Simulation',
    platforms: ['PC', 'Console']
  },

  // Indie/Popular
  {
    slug: 'among-us',
    name: 'Among Us',
    icon: '/icons/games/among-us.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Party',
    platforms: ['PC', 'Console', 'Mobile']
  },
  {
    slug: 'fall-guys',
    name: 'Fall Guys',
    icon: '/icons/games/fall-guys.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co6byb.jpg',
    category: 'Party',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'stardew-valley',
    name: 'Stardew Valley',
    icon: '/icons/games/stardew.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/xrpmydnu9rpxvxfjkiu7.jpg',
    category: 'Simulation',
    platforms: ['PC', 'Console', 'Mobile']
  },

  // Fighting
  {
    slug: 'street-fighter-6',
    name: 'Street Fighter 6',
    icon: '/icons/games/sf6.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9wxo.jpg',
    category: 'Fighting',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'tekken-8',
    name: 'Tekken 8',
    icon: '/icons/games/tekken8.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co7lbb.jpg',
    category: 'Fighting',
    platforms: ['PC', 'Console']
  },

  // Horror
  {
    slug: 'dead-by-daylight',
    name: 'Dead by Daylight',
    icon: '/icons/games/dbd.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co9dnz.jpg',
    category: 'Horror',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'phasmophobia',
    name: 'Phasmophobia',
    icon: '/icons/games/phasmophobia.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Horror',
    platforms: ['PC']
  },

  // Auto Battler
  {
    slug: 'teamfight-tactics',
    name: 'Teamfight Tactics',
    icon: '/icons/games/tft.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Auto Battler',
    platforms: ['PC', 'Mobile']
  },

  // Card Games
  {
    slug: 'hearthstone',
    name: 'Hearthstone',
    icon: '/icons/games/hearthstone.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1sh2.jpg',
    category: 'Card Game',
    platforms: ['PC', 'Mobile']
  },

  // Platform/Adventure
  {
    slug: 'hollow-knight',
    name: 'Hollow Knight',
    icon: '/icons/games/hollow-knight.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co93cr.jpg',
    category: 'Metroidvania',
    platforms: ['PC', 'Console']
  },

  // Recent Popular
  {
    slug: 'baldurs-gate-3',
    name: "Baldur's Gate 3",
    icon: '/icons/games/bg3.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co670h.jpg',
    category: 'RPG',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'hogwarts-legacy',
    name: 'Hogwarts Legacy',
    icon: '/icons/games/hogwarts.svg',
    poster: '/images/default-game-poster.svg',
    category: 'RPG',
    platforms: ['PC', 'Console']
  },
  {
    slug: 'palworld',
    name: 'Palworld',
    icon: '/icons/games/palworld.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co7n02.jpg',
    category: 'Survival',
    platforms: ['PC']
  },

  // Console Exclusives
  {
    slug: 'halo-infinite',
    name: 'Halo Infinite',
    icon: '/icons/games/halo.svg',
    poster: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2dto.jpg',
    category: 'FPS',
    platforms: ['PC', 'Xbox']
  },
  {
    slug: 'god-of-war',
    name: 'God of War',
    icon: '/icons/games/gow.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Action',
    platforms: ['PC', 'PlayStation']
  },
  {
    slug: 'spider-man',
    name: "Marvel's Spider-Man",
    icon: '/icons/games/spiderman.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Action',
    platforms: ['PC', 'PlayStation']
  },

  // Mobile Popular
  {
    slug: 'clash-royale',
    name: 'Clash Royale',
    icon: '/icons/games/clash-royale.svg',
    poster: '/images/default-game-poster.svg',
    category: 'Strategy',
    platforms: ['Mobile']
  },
  {
    slug: 'brawl-stars',
    name: 'Brawl Stars',
    icon: '/icons/games/brawl-stars.svg',
    poster: '/images/default-game-poster.svg',
    category: 'MOBA',
    platforms: ['Mobile']
  }
];

// Utility functions
export function getGameBySlug(slug: string): Game | undefined {
  return GAME_CATALOG.find(game => game.slug === slug);
}

export function getGamesByCategory(category: string): Game[] {
  return GAME_CATALOG.filter(game => game.category === category);
}

export function searchGames(query: string): Game[] {
  const lowercaseQuery = query.toLowerCase();
  return GAME_CATALOG.filter(game => 
    game.name.toLowerCase().includes(lowercaseQuery) ||
    game.slug.toLowerCase().includes(lowercaseQuery) ||
    game.category?.toLowerCase().includes(lowercaseQuery)
  );
}

export function getGameCategories(): string[] {
  const categories = new Set(GAME_CATALOG.map(game => game.category).filter(Boolean));
  return Array.from(categories).sort();
}

// Fallback icon for games without specific icons
export const DEFAULT_GAME_ICON = '/icons/games/default-game.svg';

// Fallback poster for games without specific posters
export const DEFAULT_GAME_POSTER = '/images/default-game-poster.svg';
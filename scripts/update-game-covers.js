/**
 * Script to update game covers using IGDB API
 * Run with: node scripts/update-game-covers.js
 */

const fs = require('fs');
const path = require('path');

// Game name mappings for better IGDB search results
const gameNameMappings = {
  'valorant': 'VALORANT',
  'counter-strike-2': 'Counter-Strike 2',
  'overwatch-2': 'Overwatch 2',
  'apex-legends': 'Apex Legends',
  'call-of-duty-warzone': 'Call of Duty: Warzone',
  'fortnite': 'Fortnite',
  'pubg': 'PlayerUnknown\'s Battlegrounds',
  'league-of-legends': 'League of Legends',
  'dota-2': 'Dota 2',
  'world-of-warcraft': 'World of Warcraft',
  'final-fantasy-xiv': 'Final Fantasy XIV',
  'lost-ark': 'Lost Ark',
  'genshin-impact': 'Genshin Impact',
  'minecraft': 'Minecraft',
  'rust': 'Rust',
  'valheim': 'Valheim',
  'rocket-league': 'Rocket League',
  'gran-turismo-7': 'Gran Turismo 7',
  'starcraft-2': 'StarCraft II',
  'age-of-empires-4': 'Age of Empires IV',
  'cities-skylines': 'Cities: Skylines',
  'sims-4': 'The Sims 4',
  'among-us': 'Among Us',
  'fall-guys': 'Fall Guys',
  'stardew-valley': 'Stardew Valley',
  'street-fighter-6': 'Street Fighter 6',
  'tekken-8': 'Tekken 8',
  'dead-by-daylight': 'Dead by Daylight',
  'phasmophobia': 'Phasmophobia',
  'teamfight-tactics': 'Teamfight Tactics',
  'hearthstone': 'Hearthstone',
  'hollow-knight': 'Hollow Knight',
  'baldurs-gate-3': 'Baldur\'s Gate 3',
  'hogwarts-legacy': 'Hogwarts Legacy',
  'palworld': 'Palworld',
  'halo-infinite': 'Halo Infinite',
  'god-of-war': 'God of War',
  'spider-man': 'Marvel\'s Spider-Man',
  'clash-royale': 'Clash Royale',
  'brawl-stars': 'Brawl Stars'
};

async function fetchGameCover(gameSlug) {
  try {
    const gameName = gameNameMappings[gameSlug] || gameSlug.replace(/-/g, ' ');
    const response = await fetch(`http://localhost:3000/api/igdb/covers?name=${encodeURIComponent(gameName)}`);
    
    if (!response.ok) {
      console.log(`❌ Failed to fetch cover for ${gameSlug}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    if (data.cover_url) {
      console.log(`✅ Found cover for ${gameSlug}: ${data.cover_url}`);
      return data.cover_url;
    } else {
      console.log(`⚠️  No cover found for ${gameSlug}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error fetching cover for ${gameSlug}:`, error.message);
    return null;
  }
}

async function updateGameCovers() {
  console.log('🎮 Starting IGDB cover art update...\n');
  
  // Read the current games catalog
  const gamesFilePath = path.join(__dirname, '../src/data/games.ts');
  let gamesFileContent = fs.readFileSync(gamesFilePath, 'utf8');
  
  // Extract game slugs from the file
  const gameSlugMatches = gamesFileContent.match(/slug: '([^']+)'/g);
  if (!gameSlugMatches) {
    console.log('❌ Could not find game slugs in games.ts');
    return;
  }
  
  const gameSlugs = gameSlugMatches.map(match => match.match(/slug: '([^']+)'/)[1]);
  console.log(`📋 Found ${gameSlugs.length} games to update\n`);
  
  let updatedCount = 0;
  
  // Process each game with a delay to respect rate limits
  for (const gameSlug of gameSlugs) {
    const coverUrl = await fetchGameCover(gameSlug);
    
    if (coverUrl) {
      // Update the poster URL in the file content
      const currentPosterRegex = new RegExp(`(slug: '${gameSlug}'[\\s\\S]*?)poster: '[^']*'`, 'g');
      const newPosterLine = `$1poster: '${coverUrl}'`;
      
      if (currentPosterRegex.test(gamesFileContent)) {
        gamesFileContent = gamesFileContent.replace(currentPosterRegex, newPosterLine);
        updatedCount++;
      }
    }
    
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Write the updated content back to the file
  fs.writeFileSync(gamesFilePath, gamesFileContent);
  
  console.log(`\n🎉 Updated ${updatedCount} game covers successfully!`);
  console.log('📁 Updated file: src/data/games.ts');
}

// Run the script
updateGameCovers().catch(console.error);
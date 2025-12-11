const fs = require('fs');
const path = require('path');
const https = require('https');

const iconsDir = path.join(__dirname, '../public/icons');

// App data with unique identifiers for generating icons
const appIcons = [
  // Apps (50)
  { name: 'spotify', color: '1DB954', bg: '191414' },
  { name: 'netflix', color: 'E50914', bg: '000000' },
  { name: 'youtube', color: 'FF0000', bg: 'FFFFFF' },
  { name: 'twitter', color: '1DA1F2', bg: 'FFFFFF' },
  { name: 'facebook', color: '1877F2', bg: 'FFFFFF' },
  { name: 'instagram', color: 'E4405F', bg: 'FFFFFF' },
  { name: 'whatsapp', color: '25D366', bg: 'FFFFFF' },
  { name: 'telegram', color: '0088CC', bg: 'FFFFFF' },
  { name: 'snapchat', color: 'FFFC00', bg: 'FFFFFF' },
  { name: 'tiktok', color: '000000', bg: 'FF0050' },
  { name: 'discord', color: '5865F2', bg: 'FFFFFF' },
  { name: 'slack', color: '4A154B', bg: 'FFFFFF' },
  { name: 'zoom', color: '2D8CFF', bg: 'FFFFFF' },
  { name: 'teams', color: '6264A7', bg: 'FFFFFF' },
  { name: 'notion', color: '000000', bg: 'FFFFFF' },
  { name: 'evernote', color: '00A82D', bg: 'FFFFFF' },
  { name: 'trello', color: '0079BF', bg: 'FFFFFF' },
  { name: 'asana', color: 'F06A6A', bg: 'FFFFFF' },
  { name: 'todoist', color: 'E44332', bg: 'FFFFFF' },
  { name: 'calendar', color: '4285F4', bg: 'FFFFFF' },
  { name: 'gmail', color: 'EA4335', bg: 'FFFFFF' },
  { name: 'outlook', color: '0078D4', bg: 'FFFFFF' },
  { name: 'drive', color: '4285F4', bg: 'FFFFFF' },
  { name: 'dropbox', color: '0061FF', bg: 'FFFFFF' },
  { name: 'onedrive', color: '0078D4', bg: 'FFFFFF' },
  { name: 'photos', color: '4285F4', bg: 'FFD600' },
  { name: 'camera', color: '00BCD4', bg: 'FFFFFF' },
  { name: 'gallery', color: '9C27B0', bg: 'FFFFFF' },
  { name: 'editor', color: 'FF5722', bg: 'FFFFFF' },
  { name: 'music', color: 'F44336', bg: 'FFFFFF' },
  { name: 'podcast', color: '9933FF', bg: 'FFFFFF' },
  { name: 'radio', color: '00C853', bg: 'FFFFFF' },
  { name: 'news', color: '2196F3', bg: 'FFFFFF' },
  { name: 'weather', color: '03A9F4', bg: 'FFFFFF' },
  { name: 'clock', color: '607D8B', bg: 'FFFFFF' },
  { name: 'alarm', color: 'FF9800', bg: 'FFFFFF' },
  { name: 'timer', color: '795548', bg: 'FFFFFF' },
  { name: 'notes', color: 'FFEB3B', bg: '000000' },
  { name: 'docs', color: '4285F4', bg: 'FFFFFF' },
  { name: 'sheets', color: '0F9D58', bg: 'FFFFFF' },
  { name: 'slides', color: 'F4B400', bg: 'FFFFFF' },
  { name: 'pdf', color: 'FF0000', bg: 'FFFFFF' },
  { name: 'scanner', color: '00BFA5', bg: 'FFFFFF' },
  { name: 'translate', color: '4285F4', bg: 'FFFFFF' },
  { name: 'maps', color: '4285F4', bg: '34A853' },
  { name: 'uber', color: '000000', bg: 'FFFFFF' },
  { name: 'lyft', color: 'FF00BF', bg: 'FFFFFF' },
  { name: 'airbnb', color: 'FF5A5F', bg: 'FFFFFF' },
  { name: 'booking', color: '003580', bg: 'FFFFFF' },
  { name: 'expedia', color: 'FFCC00', bg: '00355F' },
];

const gameIcons = [
  // Games (50)
  { name: 'pubg', color: 'F2A900', bg: '000000' },
  { name: 'fortnite', color: '00D4FF', bg: '1A1A2E' },
  { name: 'minecraft', color: '5D7C15', bg: '8B5A2B' },
  { name: 'roblox', color: 'FF0000', bg: '000000' },
  { name: 'genshin', color: 'FFD700', bg: '1A1A2E' },
  { name: 'codm', color: 'FF6600', bg: '000000' },
  { name: 'freefire', color: 'FF5722', bg: '1A1A2E' },
  { name: 'clash', color: 'FFD700', bg: 'E91E63' },
  { name: 'brawl', color: '00E676', bg: '000000' },
  { name: 'royale', color: '2196F3', bg: 'FFD700' },
  { name: 'legends', color: 'C4A700', bg: '1A1A2E' },
  { name: 'arena', color: 'E91E63', bg: '000000' },
  { name: 'puzzle', color: '9C27B0', bg: 'FFFFFF' },
  { name: 'candy', color: 'FF69B4', bg: 'FFFFFF' },
  { name: 'bubble', color: '00BCD4', bg: 'FFFFFF' },
  { name: 'match3', color: 'FF9800', bg: 'FFFFFF' },
  { name: 'solitaire', color: '4CAF50', bg: 'FFFFFF' },
  { name: 'chess', color: '000000', bg: 'FFFFFF' },
  { name: 'poker', color: 'B71C1C', bg: '1B5E20' },
  { name: 'slots', color: 'FFD700', bg: 'B71C1C' },
  { name: 'racing', color: 'F44336', bg: '000000' },
  { name: 'drift', color: '2196F3', bg: '000000' },
  { name: 'speed', color: 'FF5722', bg: '1A1A2E' },
  { name: 'moto', color: 'FF9800', bg: '000000' },
  { name: 'bike', color: '4CAF50', bg: '000000' },
  { name: 'runner', color: '00BCD4', bg: 'FF5722' },
  { name: 'jump', color: 'FFEB3B', bg: '4CAF50' },
  { name: 'ninja', color: '000000', bg: 'F44336' },
  { name: 'samurai', color: 'B71C1C', bg: '000000' },
  { name: 'knight', color: '607D8B', bg: 'FFFFFF' },
  { name: 'warrior', color: 'FF5722', bg: '000000' },
  { name: 'archer', color: '4CAF50', bg: '795548' },
  { name: 'zombie', color: '4CAF50', bg: '000000' },
  { name: 'survival', color: '795548', bg: '4CAF50' },
  { name: 'craft', color: '8BC34A', bg: '795548' },
  { name: 'build', color: 'FF9800', bg: '3F51B5' },
  { name: 'tower', color: '9C27B0', bg: 'FFFFFF' },
  { name: 'defense', color: '2196F3', bg: 'FFFFFF' },
  { name: 'strategy', color: '607D8B', bg: 'FFD700' },
  { name: 'empire', color: 'B8860B', bg: '000000' },
  { name: 'kingdom', color: '9C27B0', bg: 'FFD700' },
  { name: 'farm', color: '4CAF50', bg: '8BC34A' },
  { name: 'city', color: '2196F3', bg: '607D8B' },
  { name: 'tycoon', color: 'FFD700', bg: '4CAF50' },
  { name: 'idle', color: 'FF9800', bg: 'FFFFFF' },
  { name: 'clicker', color: 'E91E63', bg: 'FFFFFF' },
  { name: 'merge', color: '00BCD4', bg: 'FFFFFF' },
  { name: 'word', color: '4CAF50', bg: 'FFFFFF' },
  { name: 'trivia', color: '9C27B0', bg: 'FFEB3B' },
  { name: 'quiz', color: '2196F3', bg: 'FFFFFF' },
];

const kidsIcons = [
  // Kids (50)
  { name: 'abc', color: 'FF5722', bg: 'FFEB3B' },
  { name: 'numbers', color: '4CAF50', bg: 'FFFFFF' },
  { name: 'shapes', color: '2196F3', bg: 'FFFFFF' },
  { name: 'colors', color: 'E91E63', bg: 'FFEB3B' },
  { name: 'animals', color: '795548', bg: '8BC34A' },
  { name: 'dinosaur', color: '4CAF50', bg: 'FF9800' },
  { name: 'pets', color: 'FF9800', bg: 'FFFFFF' },
  { name: 'farm', color: '8BC34A', bg: '795548' },
  { name: 'ocean', color: '2196F3', bg: '00BCD4' },
  { name: 'space', color: '1A1A2E', bg: '9C27B0' },
  { name: 'princess', color: 'E91E63', bg: 'FFD700' },
  { name: 'fairy', color: '9C27B0', bg: 'FF69B4' },
  { name: 'unicorn', color: 'FF69B4', bg: 'FFFFFF' },
  { name: 'dragon', color: 'F44336', bg: 'FF9800' },
  { name: 'monster', color: '4CAF50', bg: '9C27B0' },
  { name: 'robot', color: '607D8B', bg: '00BCD4' },
  { name: 'car', color: 'F44336', bg: 'FFFFFF' },
  { name: 'train', color: '2196F3', bg: 'FFFFFF' },
  { name: 'plane', color: '03A9F4', bg: 'FFFFFF' },
  { name: 'boat', color: '00BCD4', bg: '2196F3' },
  { name: 'music', color: 'FF9800', bg: 'FFEB3B' },
  { name: 'piano', color: '000000', bg: 'FFFFFF' },
  { name: 'drums', color: 'B71C1C', bg: 'FFD700' },
  { name: 'dance', color: 'E91E63', bg: '9C27B0' },
  { name: 'sing', color: 'FF5722', bg: 'FFEB3B' },
  { name: 'paint', color: '2196F3', bg: 'FFEB3B' },
  { name: 'draw', color: '4CAF50', bg: 'FFFFFF' },
  { name: 'craft', color: 'FF9800', bg: 'E91E63' },
  { name: 'puzzle', color: '9C27B0', bg: 'FFFFFF' },
  { name: 'memory', color: '00BCD4', bg: 'FFFFFF' },
  { name: 'story', color: '795548', bg: 'FFEB3B' },
  { name: 'reading', color: '4CAF50', bg: 'FFFFFF' },
  { name: 'writing', color: '2196F3', bg: 'FFFFFF' },
  { name: 'math', color: 'FF5722', bg: 'FFFFFF' },
  { name: 'science', color: '00BCD4', bg: '4CAF50' },
  { name: 'coding', color: '607D8B', bg: '00BCD4' },
  { name: 'nature', color: '4CAF50', bg: '8BC34A' },
  { name: 'garden', color: '8BC34A', bg: 'FF9800' },
  { name: 'cooking', color: 'FF5722', bg: 'FFEB3B' },
  { name: 'baking', color: 'FF9800', bg: '795548' },
  { name: 'doctor', color: 'F44336', bg: 'FFFFFF' },
  { name: 'dentist', color: '00BCD4', bg: 'FFFFFF' },
  { name: 'vet', color: '4CAF50', bg: 'FF9800' },
  { name: 'builder', color: 'FF9800', bg: '607D8B' },
  { name: 'firefighter', color: 'F44336', bg: 'FFD700' },
  { name: 'police', color: '2196F3', bg: '000000' },
  { name: 'superhero', color: 'F44336', bg: '2196F3' },
  { name: 'explorer', color: '795548', bg: '4CAF50' },
  { name: 'sports', color: 'FF5722', bg: '4CAF50' },
  { name: 'yoga', color: '9C27B0', bg: 'FFFFFF' },
];

function downloadIcon(icon, category, index) {
  return new Promise((resolve, reject) => {
    const initial = icon.name.charAt(0).toUpperCase();
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(icon.name)}&background=${icon.bg}&color=${icon.color}&size=512&bold=true&format=png`;

    const filename = path.join(iconsDir, category, `${String(index + 1).padStart(2, '0')}_${icon.name}.png`);
    const file = fs.createWriteStream(filename);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${category}/${icon.name}`);
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Starting icon downloads...\n');

  const categories = [
    { icons: appIcons, name: 'apps' },
    { icons: gameIcons, name: 'games' },
    { icons: kidsIcons, name: 'kids' },
  ];

  for (const category of categories) {
    console.log(`\nDownloading ${category.name} icons...`);
    for (let i = 0; i < category.icons.length; i++) {
      try {
        await downloadIcon(category.icons[i], category.name, i);
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
      } catch (err) {
        console.error(`Failed to download ${category.icons[i].name}:`, err.message);
      }
    }
  }

  console.log('\nDone!');
}

downloadAll();

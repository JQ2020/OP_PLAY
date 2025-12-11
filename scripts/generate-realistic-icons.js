const fs = require('fs');
const path = require('path');
const https = require('https');

const iconsDir = path.join(__dirname, '../public/icons');

// 使用 DiceBear API 生成更真实的图标
// 不同的样式会产生更专业的应用图标外观

const appIconStyles = [
  'identicon', 'bottts', 'avataaars', 'big-smile', 'initials', 'shapes',
  'thumbs', 'lorelei', 'notionists', 'personas', 'pixel-art', 'rings'
];

const colorSchemes = {
  apps: ['4285F4', 'EA4335', '34A853', 'FBBC04', '9C27B0', 'FF6B6B', '4ECDC4',
         '45B7D1', 'F7DC6F', '52BE80', 'AF7AC5', 'EC7063', '5DADE2', 'F8B500',
         '00B894', 'E17055', '6C5CE7', 'FDCB6E', '55EFC4', 'A29BFE', 'FF7675',
         '74B9FF', 'E17055', '00B894', '0984E3', 'DFE6E9', '636E72', 'FD79A8',
         'FDCB6E', 'E17055', '00CEC9', '0984E3', 'B2BEC3', 'FDA7DF', '81ECEC',
         'FAB1A0', '6C5CE7', 'A29BFE', 'FF7675', 'FD79A8', 'FDCB6E', '55EFC4',
         'E84393', '00B894', '00CEC9', '0984E3', '2D3436', 'DFE6E9', 'B2BEC3',
         '74B9FF', 'A29BFE'],
  games: ['E74C3C', 'E67E22', 'F39C12', '9B59B6', '8E44AD', 'C0392B', 'D35400',
          'F1C40F', '16A085', '27AE60', '2980B9', '8E44AD', '2C3E50', 'E74C3C',
          '95A5A6', 'D35400', 'C0392B', 'BDC3C7', '7F8C8D', 'E67E22', '9B59B6',
          '3498DB', '1ABC9C', '2ECC71', 'F39C12', 'E74C3C', '8E44AD', '2C3E50',
          'E67E22', 'D35400', '16A085', '27AE60', '2980B9', 'F1C40F', 'C0392B',
          '95A5A6', '7F8C8D', 'BDC3C7', '3498DB', '1ABC9C', '2ECC71', '9B59B6',
          'E74C3C', 'F39C12', '8E44AD', '2C3E50', '34495E', 'E67E22', 'D35400',
          '16A085'],
  kids: ['FF6B9D', 'FFA07A', 'FFD93D', '6BCF7F', '4FC3F7', 'BA68C8', 'FF8A65',
         'FFE082', '81C784', '4DD0E1', '9575CD', 'F06292', 'FFB74D', 'AED581',
         '4DB6AC', '7986CB', 'E57373', 'FFD54F', '9CCC65', '4FC3F7', 'F06292',
         'BA68C8', 'FFA726', '66BB6A', '29B6F6', '9575CD', 'EF5350', 'FFCA28',
         '8BC34A', '26C6DA', '7E57C2', 'EC407A', 'FFA726', '9CCC65', '26A69A',
         '5C6BC0', 'EF5350', 'FFCA28', '8BC34A', '29B6F6', 'AB47BC', 'FF7043',
         'FFD54F', '66BB6A', '26C6DA', '7E57C2', 'EC407A', 'FF8A65', 'AED581',
         '4DD0E1']
};

function generateIconUrl(seed, category, index) {
  // 使用 DiceBear API 生成高质量的应用图标
  const styleIndex = index % appIconStyles.length;
  const style = appIconStyles[styleIndex];
  const colors = colorSchemes[category];
  const color = colors[index % colors.length].replace('#', '');

  // DiceBear Avatars API - 生成 SVG 格式的图标
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${color}&size=512`;
}

function downloadIcon(seed, category, index, filename) {
  return new Promise((resolve, reject) => {
    const url = generateIconUrl(seed, category, index);
    const filepath = path.join(iconsDir, category, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${category}/${filename}`);
          resolve(filepath);
        });
      } else {
        fs.unlink(filepath, () => {});
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateAllIcons() {
  console.log('Generating realistic app icons...\n');

  const categories = [
    { name: 'apps', count: 50, seeds: [
      'spotify', 'netflix', 'youtube', 'twitter', 'facebook', 'instagram', 'whatsapp',
      'telegram', 'snapchat', 'tiktok', 'discord', 'slack', 'zoom', 'teams', 'notion',
      'evernote', 'trello', 'asana', 'todoist', 'calendar', 'gmail', 'outlook', 'drive',
      'dropbox', 'onedrive', 'photos', 'camera', 'gallery', 'editor', 'music', 'podcast',
      'radio', 'news', 'weather', 'clock', 'alarm', 'timer', 'notes', 'docs', 'sheets',
      'slides', 'pdf', 'scanner', 'translate', 'maps', 'uber', 'lyft', 'airbnb', 'booking',
      'expedia'
    ]},
    { name: 'games', count: 50, seeds: [
      'pubg', 'fortnite', 'minecraft', 'roblox', 'genshin', 'codm', 'freefire', 'clash',
      'brawl', 'royale', 'legends', 'arena', 'puzzle', 'candy', 'bubble', 'match3',
      'solitaire', 'chess', 'poker', 'slots', 'racing', 'drift', 'speed', 'moto', 'bike',
      'runner', 'jump', 'ninja', 'samurai', 'knight', 'warrior', 'archer', 'zombie',
      'survival', 'craft', 'build', 'tower', 'defense', 'strategy', 'empire', 'kingdom',
      'farm', 'city', 'tycoon', 'idle', 'clicker', 'merge', 'word', 'trivia', 'quiz'
    ]},
    { name: 'kids', count: 50, seeds: [
      'abc', 'numbers', 'shapes', 'colors', 'animals', 'dinosaur', 'pets', 'farm', 'ocean',
      'space', 'princess', 'fairy', 'unicorn', 'dragon', 'monster', 'robot', 'car', 'train',
      'plane', 'boat', 'music', 'piano', 'drums', 'dance', 'sing', 'paint', 'draw', 'craft',
      'puzzle', 'memory', 'story', 'reading', 'writing', 'math', 'science', 'coding', 'nature',
      'garden', 'cooking', 'baking', 'doctor', 'dentist', 'vet', 'builder', 'firefighter',
      'police', 'superhero', 'explorer', 'sports', 'yoga'
    ]}
  ];

  for (const category of categories) {
    console.log(`\nGenerating ${category.name} icons...`);

    for (let i = 0; i < category.count; i++) {
      try {
        const seed = category.seeds[i];
        const filename = `${String(i + 1).padStart(2, '0')}_${seed}.svg`;
        await downloadIcon(seed, category.name, i, filename);

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
      } catch (err) {
        console.error(`✗ Failed to generate ${category.name}/${i + 1}:`, err.message);
      }
    }
  }

  console.log('\n✅ Icon generation completed!');
}

generateAllIcons().catch(console.error);

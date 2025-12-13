import fs from 'fs';

const data = JSON.parse(fs.readFileSync('/tmp/apps_data.json', 'utf8'));

const formatApp = (app) => {
  return `  { title: ${JSON.stringify(app.title)}, developer: ${JSON.stringify(app.developer)}, iconUrl: ${JSON.stringify(app.iconUrl)}, rating: ${app.rating}, downloads: ${JSON.stringify(app.downloads)}, category: ${JSON.stringify(app.category)}, size: ${JSON.stringify(app.size)}, version: ${JSON.stringify(app.version)} }`;
};

let output = '';
output += '// ==================== APPS (' + data.apps.length + ') ====================\n';
output += 'const apps = [\n';
output += data.apps.map(formatApp).join(',\n');
output += '\n];\n\n';
output += '// ==================== GAMES (' + data.games.length + ') ====================\n';
output += 'const games = [\n';
output += data.games.map(formatApp).join(',\n');
output += '\n];\n\n';
output += '// ==================== KIDS (' + data.kids.length + ') ====================\n';
output += 'const kids = [\n';
output += data.kids.map(formatApp).join(',\n');
output += '\n];\n';

fs.writeFileSync('/tmp/seed_data.ts', output);
console.log('Generated seed data to /tmp/seed_data.ts');
console.log('Apps:', data.apps.length);
console.log('Games:', data.games.length);
console.log('Kids:', data.kids.length);

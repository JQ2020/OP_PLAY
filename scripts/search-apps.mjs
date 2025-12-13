import gplay from 'google-play-scraper';

async function search(term) {
  const results = await gplay.search({ term, num: 3 });
  console.log(term + ':');
  results.forEach(r => console.log('  ' + r.appId + ' -> ' + r.title));
}

await search('My Talking Angela');
await search('Snake.io');

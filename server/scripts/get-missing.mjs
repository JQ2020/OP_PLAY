import gplay from 'google-play-scraper';

const apps = [
  { title: "My Talking Angela", packageId: "com.outfit7.mytalkingangelafree" },
  { title: "Snake.io - Fun Snake .io Games", packageId: "com.amelosinteractive.snake" },
];

for (const app of apps) {
  try {
    const data = await gplay.app({ appId: app.packageId });
    console.log(app.title + ': ' + data.icon + '=w512-h512');
  } catch (e) {
    console.log(app.title + ': FAILED - ' + e.message);
  }
}

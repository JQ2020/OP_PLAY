import gplay from 'google-play-scraper';

// Apps that need icon fixes with their package IDs
const appsToFix = [
  { title: "Todoist: Planner & Calendar", packageId: "com.todoist" },
  { title: "Microsoft Outlook", packageId: "com.microsoft.office.outlook" },
  { title: "Podcast Addict: Podcast player", packageId: "com.bambuna.podcastaddict" },
  { title: "Fortnite", packageId: "com.epicgames.fortnite" },
  { title: "Minecraft: Dream it, Build it!", packageId: "com.mojang.minecraftpe" },
  { title: "Call of Duty®: Mobile", packageId: "com.activision.callofduty.shooter" },
  { title: "Hill Climb Racing", packageId: "com.fingersoft.hillclimb" },
  { title: "Crossy Road", packageId: "com.yodo1.crossyroad" },
  { title: "Geometry Dash", packageId: "com.robtopx.geometryjump" },
  { title: "Endless Numbers", packageId: "com.originatorkids.EndlessNumbers" },
  { title: "Learn to Read - Duolingo ABC", packageId: "com.duolingo.literacy" },
  { title: "Talking Ben the Dog", packageId: "com.outfit7.talkingben" },
  { title: "My Talking Tom", packageId: "com.outfit7.mytalkingtomfree" },
  { title: "Super Mario Run", packageId: "com.nintendo.zara" },
  { title: "Cut the Rope 2", packageId: "com.zeptolab.ctr2.f2p.google" },
  { title: "Where's My Water? 2", packageId: "com.disney.wheresmywater2_goo" },
  { title: "Angry Birds Dream Blast", packageId: "com.rovio.dream" },
  { title: "Bad Piggies", packageId: "com.rovio.BadPiggies" },
  { title: "Sonic Dash: Endless Run", packageId: "com.sega.sonicdash" },
  { title: "Talking Tom Cat", packageId: "com.outfit7.talkingtom" },
  { title: "My Talking Angela", packageId: "com.outfit7.mytalkingangela" },
  { title: "Bowmasters: Archery Shooting", packageId: "com.playgendary.bowmasters" },
  { title: "Doodle Jump", packageId: "com.lima.doodlejump" },
  { title: "Snake.io - Fun Snake .io Games", packageId: "com.kooapps.snakeio" },
];

const results = {};

for (const app of appsToFix) {
  try {
    const data = await gplay.app({ appId: app.packageId });
    const iconUrl = data.icon + '=w512-h512';
    results[app.title] = iconUrl;
    console.log(`OK: ${app.title}`);
  } catch (e) {
    console.log(`FAILED: ${app.title} - ${e.message}`);
    results[app.title] = null;
  }
}

console.log('\n--- Results ---');
console.log(JSON.stringify(results, null, 2));

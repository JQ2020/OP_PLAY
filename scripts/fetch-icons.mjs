import gplay from 'google-play-scraper';

// 150 个真实应用的包名列表
const allApps = [
  // ==================== APPS (50) ====================
  // Entertainment & Social
  { title: "Spotify", packageId: "com.spotify.music", category: "Entertainment" },
  { title: "Netflix", packageId: "com.netflix.mediaclient", category: "Entertainment" },
  { title: "YouTube", packageId: "com.google.android.youtube", category: "Entertainment" },
  { title: "X", packageId: "com.twitter.android", category: "Social" },
  { title: "Facebook", packageId: "com.facebook.katana", category: "Social" },
  { title: "Instagram", packageId: "com.instagram.android", category: "Social" },
  { title: "WhatsApp", packageId: "com.whatsapp", category: "Social" },
  { title: "Telegram", packageId: "org.telegram.messenger", category: "Social" },
  { title: "Snapchat", packageId: "com.snapchat.android", category: "Social" },
  { title: "TikTok", packageId: "com.zhiliaoapp.musically", category: "Entertainment" },
  { title: "Discord", packageId: "com.discord", category: "Social" },
  { title: "Slack", packageId: "com.Slack", category: "Productivity" },
  { title: "Zoom", packageId: "us.zoom.videomeetings", category: "Productivity" },
  { title: "Microsoft Teams", packageId: "com.microsoft.teams", category: "Productivity" },
  { title: "Notion", packageId: "notion.id", category: "Productivity" },
  { title: "Evernote", packageId: "com.evernote", category: "Productivity" },
  { title: "Trello", packageId: "com.trello", category: "Productivity" },
  { title: "Asana", packageId: "com.asana.app", category: "Productivity" },
  { title: "Todoist", packageId: "com.todoist", category: "Productivity" },
  { title: "Google Calendar", packageId: "com.google.android.calendar", category: "Productivity" },
  { title: "Gmail", packageId: "com.google.android.gm", category: "Productivity" },
  { title: "Microsoft Outlook", packageId: "com.microsoft.office.outlook", category: "Productivity" },
  { title: "Google Drive", packageId: "com.google.android.apps.docs", category: "Productivity" },
  { title: "Dropbox", packageId: "com.dropbox.android", category: "Productivity" },
  { title: "Microsoft OneDrive", packageId: "com.microsoft.skydrive", category: "Productivity" },
  { title: "Google Photos", packageId: "com.google.android.apps.photos", category: "Photography" },
  { title: "Snapseed", packageId: "com.niksoftware.snapseed", category: "Photography" },
  { title: "VSCO", packageId: "com.vsco.cam", category: "Photography" },
  { title: "Lightroom", packageId: "com.adobe.lrmobile", category: "Photography" },
  { title: "Pinterest", packageId: "com.pinterest", category: "Social" },
  { title: "Podcast Addict", packageId: "com.bambuna.podcastaddict", category: "Entertainment" },
  { title: "Spotify for Podcasters", packageId: "com.spotify.s4a", category: "Entertainment" },
  { title: "Google News", packageId: "com.google.android.apps.magazines", category: "News" },
  { title: "Flipboard", packageId: "flipboard.app", category: "News" },
  { title: "Google Clock", packageId: "com.google.android.deskclock", category: "Tools" },
  { title: "Google Calculator", packageId: "com.google.android.calculator", category: "Tools" },
  { title: "Google Keep", packageId: "com.google.android.keep", category: "Productivity" },
  { title: "Google Docs", packageId: "com.google.android.apps.docs.editors.docs", category: "Productivity" },
  { title: "Google Sheets", packageId: "com.google.android.apps.docs.editors.sheets", category: "Productivity" },
  { title: "Google Slides", packageId: "com.google.android.apps.docs.editors.slides", category: "Productivity" },
  { title: "Adobe Acrobat Reader", packageId: "com.adobe.reader", category: "Productivity" },
  { title: "Microsoft Word", packageId: "com.microsoft.office.word", category: "Productivity" },
  { title: "Google Translate", packageId: "com.google.android.apps.translate", category: "Tools" },
  { title: "Google Maps", packageId: "com.google.android.apps.maps", category: "Travel" },
  { title: "Uber", packageId: "com.ubercab", category: "Travel" },
  { title: "Lyft", packageId: "me.lyft.android", category: "Travel" },
  { title: "Airbnb", packageId: "com.airbnb.android", category: "Travel" },
  { title: "Booking.com", packageId: "com.booking", category: "Travel" },
  { title: "Expedia", packageId: "com.expedia.bookings", category: "Travel" },
  { title: "Duolingo", packageId: "com.duolingo", category: "Education" },

  // ==================== GAMES (50) ====================
  { title: "PUBG Mobile", packageId: "com.tencent.ig", category: "Games" },
  { title: "Fortnite", packageId: "com.epicgames.fortnite", category: "Games" },
  { title: "Minecraft", packageId: "com.mojang.minecraftpe", category: "Games" },
  { title: "Roblox", packageId: "com.roblox.client", category: "Games" },
  { title: "Genshin Impact", packageId: "com.miHoYo.GenshinImpact", category: "Games" },
  { title: "Call of Duty Mobile", packageId: "com.activision.callofduty.shooter", category: "Games" },
  { title: "Free Fire MAX", packageId: "com.dts.freefiremax", category: "Games" },
  { title: "Clash of Clans", packageId: "com.supercell.clashofclans", category: "Games" },
  { title: "Brawl Stars", packageId: "com.supercell.brawlstars", category: "Games" },
  { title: "Clash Royale", packageId: "com.supercell.clashroyale", category: "Games" },
  { title: "Mobile Legends", packageId: "com.mobile.legends", category: "Games" },
  { title: "League of Legends Wild Rift", packageId: "com.riotgames.league.wildrift", category: "Games" },
  { title: "Among Us", packageId: "com.innersloth.spacemafia", category: "Games" },
  { title: "Candy Crush Saga", packageId: "com.king.candycrushsaga", category: "Games" },
  { title: "Candy Crush Soda Saga", packageId: "com.king.candycrushsodasaga", category: "Games" },
  { title: "Homescapes", packageId: "com.playrix.homescapes", category: "Games" },
  { title: "Gardenscapes", packageId: "com.playrix.gardenscapes", category: "Games" },
  { title: "Solitaire", packageId: "com.mobilityware.solitaire", category: "Games" },
  { title: "Chess.com", packageId: "com.chess", category: "Games" },
  { title: "8 Ball Pool", packageId: "com.miniclip.eightballpool", category: "Games" },
  { title: "Real Racing 3", packageId: "com.ea.games.r3_row", category: "Games" },
  { title: "Need for Speed No Limits", packageId: "com.ea.game.nfs14_row", category: "Games" },
  { title: "Traffic Rider", packageId: "com.skgames.trafficrider", category: "Games" },
  { title: "Subway Surfers", packageId: "com.kiloo.subwaysurf", category: "Games" },
  { title: "Temple Run 2", packageId: "com.imangi.templerun2", category: "Games" },
  { title: "Plants vs Zombies 2", packageId: "com.ea.game.pvz2_row", category: "Games" },
  { title: "Archero", packageId: "com.habby.archero", category: "Games" },
  { title: "Last Day on Earth", packageId: "zombie.survival.craft.z", category: "Games" },
  { title: "Rise of Kingdoms", packageId: "com.lilithgame.roc.gp", category: "Games" },
  { title: "Lords Mobile", packageId: "com.igg.android.lordsmobile", category: "Games" },
  { title: "Hay Day", packageId: "com.supercell.hayday", category: "Games" },
  { title: "SimCity BuildIt", packageId: "com.ea.game.simcitymobile_row", category: "Games" },
  { title: "Township", packageId: "com.playrix.township", category: "Games" },
  { title: "Idle Miner Tycoon", packageId: "com.fluffyfairygames.idleminertycoon", category: "Games" },
  { title: "Idle Heroes", packageId: "com.droidhang.ad", category: "Games" },
  { title: "Cookie Run Kingdom", packageId: "com.devsisters.ck", category: "Games" },
  { title: "Merge Dragons", packageId: "com.gramgames.mergedragons", category: "Games" },
  { title: "Wordscapes", packageId: "com.peoplefun.wordcross", category: "Games" },
  { title: "Trivia Crack", packageId: "com.etermax.preguntados.lite", category: "Games" },
  { title: "Pokemon GO", packageId: "com.nianticlabs.pokemongo", category: "Games" },
  { title: "Dragon Ball Legends", packageId: "com.bandainamcoent.dblegends_ww", category: "Games" },
  { title: "EA Sports FC Mobile", packageId: "com.ea.gp.fifamobile", category: "Games" },
  { title: "eFootball", packageId: "jp.konami.pesam", category: "Games" },
  // Additional popular games to replace failed ones
  { title: "Asphalt 9", packageId: "com.gameloft.android.ANMP.GloftA9HM", category: "Games" },
  { title: "Hill Climb Racing", packageId: "com.fingersoft.hillclimb", category: "Games" },
  { title: "Angry Birds 2", packageId: "com.rovio.angrybirds2.revo", category: "Games" },
  { title: "Crossy Road", packageId: "com.yodo1.crossyroad", category: "Games" },
  { title: "Geometry Dash", packageId: "com.robtopx.geometryjump", category: "Games" },
  { title: "Fruit Ninja", packageId: "com.halfbrick.fruitninjafree", category: "Games" },
  { title: "Jetpack Joyride", packageId: "com.halfbrick.jetpackjoyride", category: "Games" },

  // ==================== KIDS (50) ====================
  { title: "YouTube Kids", packageId: "com.google.android.apps.youtube.kids", category: "Kids" },
  { title: "Khan Academy Kids", packageId: "org.khankids.android", category: "Kids" },
  { title: "ABCmouse", packageId: "com.aofl.abcmouse", category: "Kids" },
  { title: "Toca Life World", packageId: "com.tocaboca.tocalifeworld", category: "Kids" },
  { title: "Toca Hair Salon 4", packageId: "com.tocaboca.tocahairsalon4", category: "Kids" },
  { title: "PBS Kids Games", packageId: "org.pbskids.gamesapp", category: "Kids" },
  { title: "Disney+", packageId: "com.disney.disneyplus", category: "Kids" },
  { title: "LEGO Tower", packageId: "com.nimblebit.legotower", category: "Kids" },
  { title: "My Talking Tom 2", packageId: "com.outfit7.mytalkingtom2", category: "Kids" },
  { title: "My Talking Angela 2", packageId: "com.outfit7.mytalkingangela2", category: "Kids" },
  { title: "Talking Tom Gold Run", packageId: "com.outfit7.talkingtomgoldrun", category: "Kids" },
  { title: "Pou", packageId: "me.pou.app", category: "Kids" },
  { title: "Baby Panda World", packageId: "com.sinyee.babybus.world", category: "Kids" },
  { title: "Baby Panda Care", packageId: "com.sinyee.babybus.care", category: "Kids" },
  { title: "Piano Kids", packageId: "com.orange.kidspiano.music.songs", category: "Kids" },
  { title: "Fruit Ninja", packageId: "com.halfbrick.fruitninjafree", category: "Kids" },
  { title: "Jetpack Joyride", packageId: "com.halfbrick.jetpackjoyride", category: "Kids" },
  { title: "Endless Alphabet", packageId: "com.originatorkids.EndlessAlphabet", category: "Kids" },
  { title: "Endless Numbers", packageId: "com.originatorkids.EndlessNumbers", category: "Kids" },
  { title: "ScratchJr", packageId: "org.scratchjr.android", category: "Kids" },
  { title: "Little Panda Restaurant", packageId: "com.sinyee.babybus.restaurant", category: "Kids" },
  { title: "Dr. Panda Restaurant 3", packageId: "com.drpanda.restaurant3", category: "Kids" },
  { title: "Toddler Games", packageId: "com.bimiboo.playandlearn", category: "Kids" },
  { title: "Duolingo ABC", packageId: "com.duolingo.literacy", category: "Kids" },
  { title: "Talking Ben the Dog", packageId: "com.outfit7.talkingben", category: "Kids" },
  { title: "My Talking Tom", packageId: "com.outfit7.mytalkingtomfree", category: "Kids" },
  // More verified kids apps
  { title: "Nick Jr", packageId: "com.nick.nickjr", category: "Kids" },
  { title: "Coloring Book", packageId: "com.happycolor.coloring.book.color.painting", category: "Kids" },
  { title: "LEGO Life", packageId: "com.lego.bricklife", category: "Kids" },
  { title: "Super Mario Run", packageId: "com.nintendo.zara", category: "Kids" },
  { title: "Cut the Rope 2", packageId: "com.zeptolab.ctr2.f2p.google", category: "Kids" },
  { title: "Where's My Water 2", packageId: "com.disney.wheresmywater2_goo", category: "Kids" },
  { title: "Angry Birds Journey", packageId: "com.rovio.ABjourney", category: "Kids" },
  { title: "Angry Birds POP", packageId: "com.rovio.ABpop", category: "Kids" },
  { title: "Angry Birds Dream Blast", packageId: "com.rovio.dream", category: "Kids" },
  { title: "Bad Piggies", packageId: "com.rovio.BadPiggies", category: "Kids" },
  { title: "Sonic Dash", packageId: "com.sega.sonicdash", category: "Kids" },
  { title: "Sonic Forces", packageId: "com.sega.sonic.forces", category: "Kids" },
  { title: "PAC-MAN Party Royale", packageId: "com.bandainamcoent.pacman256", category: "Kids" },
  { title: "Talking Tom Hero Dash", packageId: "com.outfit7.talkingtomherodash", category: "Kids" },
  { title: "Talking Tom Pool", packageId: "com.outfit7.talkingtompool", category: "Kids" },
  { title: "Talking Tom Cat", packageId: "com.outfit7.talkingtom", category: "Kids" },
  { title: "Talking Tom Friends", packageId: "com.outfit7.talkingtomfriends", category: "Kids" },
  { title: "My Angela", packageId: "com.outfit7.mytalkingangelafree", category: "Kids" },
  { title: "Bouncemasters", packageId: "com.playgendary.bouncemasters", category: "Kids" },
  { title: "Bowmasters", packageId: "com.playgendary.bowmasters", category: "Kids" },
  { title: "Doodle Jump", packageId: "com.lima.doodlejump", category: "Kids" },
  { title: "Crossy Road Castle", packageId: "com.hipsterwhale.crossycastle", category: "Kids" },
  { title: "Snake.io", packageId: "com.amelosinteractive.snake", category: "Kids" },
  { title: "Slither.io", packageId: "air.com.lowtech.slither", category: "Kids" },
];

async function fetchAppInfo(app, index) {
  try {
    const result = await gplay.app({ appId: app.packageId });
    // 添加尺寸参数确保图片能正确加载
    const iconUrl = result.icon + "=w512-h512";
    console.log(`✓ [${index + 1}/150] ${result.title}`);
    return {
      title: result.title,
      developer: result.developer,
      iconUrl: iconUrl,
      rating: Math.round(result.score * 10) / 10 || 4.5,
      downloads: result.installs || "10M+",
      category: app.category,
      size: result.size || "50 MB",
      version: result.version || "1.0.0",
    };
  } catch (error) {
    console.log(`✗ [${index + 1}/150] ${app.title} (${app.packageId}): ${error.message}`);
    return null;
  }
}

async function main() {
  const totalApps = allApps.length;
  console.log(`Fetching ${totalApps} real apps from Play Store...\n`);

  const results = { apps: [], games: [], kids: [] };
  const failed = [];

  for (let i = 0; i < allApps.length; i++) {
    const app = allApps[i];
    const info = await fetchAppInfo(app, i);

    if (info) {
      // 按 category 字段分类
      if (app.category === "Games") {
        results.games.push(info);
      } else if (app.category === "Kids") {
        results.kids.push(info);
      } else {
        results.apps.push(info);
      }
    } else {
      failed.push(app);
    }

    // 避免请求过快
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n\nSuccess: ${totalApps - failed.length}/${totalApps}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Apps: ${results.apps.length}, Games: ${results.games.length}, Kids: ${results.kids.length}`);

  if (failed.length > 0) {
    console.log("\nFailed apps:");
    failed.forEach(app => console.log(`  - ${app.title} (${app.packageId})`));
  }

  // 输出 JSON
  console.log("\n\n=== RESULTS JSON ===\n");
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);

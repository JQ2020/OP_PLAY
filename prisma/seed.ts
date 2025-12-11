import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const reviews = [
  { userName: "John Doe", rating: 5, content: "Absolutely amazing! Smooth experience and thoughtful design." },
  { userName: "Jane Smith", rating: 4, content: "Great features, but could use a dark mode update." },
  { userName: "Alex Johnson", rating: 3, content: "It's okay, but crashes occasionally on my old phone." },
  { userName: "Emily Davis", rating: 5, content: "Best in class. Highly recommend!" },
  { userName: "Michael Brown", rating: 2, content: "Too many ads recently. Disappointed." },
  { userName: "Priya Patel", rating: 4, content: "Love the regular updates and the speed improvements." },
  { userName: "Carlos Santana", rating: 5, content: "Exactly what I needed for daily use. Intuitive and reliable." },
  { userName: "Lin Wei", rating: 4, content: "Good balance of features without feeling overwhelming." },
  { userName: "Sarah Miller", rating: 5, content: "Perfect app for everyday tasks. Very user friendly!" },
  { userName: "David Kim", rating: 4, content: "Solid performance. Would recommend to others." },
];

const screenshotSets = [
  ["/placeholders/screen-1.svg", "/placeholders/screen-2.svg", "/placeholders/screen-3.svg"],
  ["/placeholders/screen-2.svg", "/placeholders/screen-3.svg", "/placeholders/screen-1.svg"],
  ["/placeholders/screen-3.svg", "/placeholders/screen-1.svg", "/placeholders/screen-2.svg"],
];

// ==================== APPS (50) ====================
const apps = [
  { title: "Spotify - Music & Podcasts", developer: "Spotify AB", iconUrl: "/icons/apps/01_spotify.svg", rating: 4.5, downloads: "1B+", category: "Entertainment", size: "30 MB", version: "8.8.32" },
  { title: "Netflix", developer: "Netflix, Inc.", iconUrl: "/icons/apps/02_netflix.svg", rating: 4.4, downloads: "1B+", category: "Entertainment", size: "75 MB", version: "16.25.0" },
  { title: "YouTube", developer: "Google LLC", iconUrl: "/icons/apps/03_youtube.svg", rating: 4.3, downloads: "10B+", category: "Entertainment", size: "45 MB", version: "18.45.36" },
  { title: "Twitter / X", developer: "X Corp.", iconUrl: "/icons/apps/04_twitter.svg", rating: 4.0, downloads: "1B+", category: "Social", size: "85 MB", version: "10.23.0" },
  { title: "Facebook", developer: "Meta Platforms, Inc.", iconUrl: "/icons/apps/05_facebook.svg", rating: 4.1, downloads: "5B+", category: "Social", size: "65 MB", version: "438.0.0" },
  { title: "Instagram", developer: "Meta Platforms, Inc.", iconUrl: "/icons/apps/06_instagram.svg", rating: 4.5, downloads: "5B+", category: "Social", size: "55 MB", version: "280.0.0" },
  { title: "WhatsApp Messenger", developer: "WhatsApp LLC", iconUrl: "/icons/apps/07_whatsapp.svg", rating: 4.6, downloads: "5B+", category: "Social", size: "45 MB", version: "2.23.10" },
  { title: "Telegram", developer: "Telegram FZ-LLC", iconUrl: "/icons/apps/08_telegram.svg", rating: 4.4, downloads: "1B+", category: "Social", size: "35 MB", version: "9.6.5" },
  { title: "Snapchat", developer: "Snap Inc.", iconUrl: "/icons/apps/09_snapchat.svg", rating: 4.2, downloads: "1B+", category: "Social", size: "95 MB", version: "12.58.0" },
  { title: "TikTok", developer: "TikTok Pte. Ltd.", iconUrl: "/icons/apps/10_tiktok.svg", rating: 4.4, downloads: "1B+", category: "Entertainment", size: "92 MB", version: "34.2.3" },
  { title: "Discord - Chat & Calls", developer: "Discord Inc.", iconUrl: "/icons/apps/11_discord.svg", rating: 4.6, downloads: "500M+", category: "Social", size: "110 MB", version: "194.12" },
  { title: "Slack", developer: "Slack Technologies", iconUrl: "/icons/apps/12_slack.svg", rating: 4.2, downloads: "100M+", category: "Productivity", size: "110 MB", version: "24.01.10" },
  { title: "Zoom - Video Meetings", developer: "Zoom Video Communications", iconUrl: "/icons/apps/13_zoom.svg", rating: 4.3, downloads: "500M+", category: "Productivity", size: "85 MB", version: "5.17.0" },
  { title: "Microsoft Teams", developer: "Microsoft Corporation", iconUrl: "/icons/apps/14_teams.svg", rating: 4.5, downloads: "500M+", category: "Productivity", size: "95 MB", version: "1449.1.0" },
  { title: "Notion - Notes & Projects", developer: "Notion Labs, Inc.", iconUrl: "/icons/apps/15_notion.svg", rating: 4.8, downloads: "10M+", category: "Productivity", size: "20 MB", version: "0.6.150" },
  { title: "Evernote - Note Organizer", developer: "Evernote Corporation", iconUrl: "/icons/apps/16_evernote.svg", rating: 4.3, downloads: "100M+", category: "Productivity", size: "75 MB", version: "10.68.0" },
  { title: "Trello - Project Management", developer: "Atlassian, Inc.", iconUrl: "/icons/apps/17_trello.svg", rating: 4.4, downloads: "50M+", category: "Productivity", size: "45 MB", version: "2023.12" },
  { title: "Asana - Work Manager", developer: "Asana, Inc.", iconUrl: "/icons/apps/18_asana.svg", rating: 4.5, downloads: "10M+", category: "Productivity", size: "55 MB", version: "8.75.0" },
  { title: "Todoist - To-Do List", developer: "Doist Inc.", iconUrl: "/icons/apps/19_todoist.svg", rating: 4.7, downloads: "50M+", category: "Productivity", size: "15 MB", version: "10.0.5" },
  { title: "Google Calendar", developer: "Google LLC", iconUrl: "/icons/apps/20_calendar.svg", rating: 4.4, downloads: "1B+", category: "Productivity", size: "25 MB", version: "2023.50" },
  { title: "Gmail - Email by Google", developer: "Google LLC", iconUrl: "/icons/apps/21_gmail.svg", rating: 4.3, downloads: "10B+", category: "Productivity", size: "55 MB", version: "2023.12" },
  { title: "Microsoft Outlook", developer: "Microsoft Corporation", iconUrl: "/icons/apps/22_outlook.svg", rating: 4.5, downloads: "500M+", category: "Productivity", size: "105 MB", version: "4.2347.0" },
  { title: "Google Drive", developer: "Google LLC", iconUrl: "/icons/apps/23_drive.svg", rating: 4.4, downloads: "5B+", category: "Productivity", size: "60 MB", version: "2.23.181" },
  { title: "Dropbox - Cloud Storage", developer: "Dropbox, Inc.", iconUrl: "/icons/apps/24_dropbox.svg", rating: 4.4, downloads: "1B+", category: "Productivity", size: "185 MB", version: "337.2.2" },
  { title: "Microsoft OneDrive", developer: "Microsoft Corporation", iconUrl: "/icons/apps/25_onedrive.svg", rating: 4.5, downloads: "1B+", category: "Productivity", size: "90 MB", version: "7.33" },
  { title: "Google Photos", developer: "Google LLC", iconUrl: "/icons/apps/26_photos.svg", rating: 4.5, downloads: "5B+", category: "Photography", size: "55 MB", version: "6.65.0" },
  { title: "Camera Pro - HD Camera", developer: "Simple Design Ltd.", iconUrl: "/icons/apps/27_camera.svg", rating: 4.3, downloads: "100M+", category: "Photography", size: "35 MB", version: "2.5.0" },
  { title: "Gallery - Photo Album", developer: "Gallery Inc.", iconUrl: "/icons/apps/28_gallery.svg", rating: 4.4, downloads: "500M+", category: "Photography", size: "25 MB", version: "3.12.0" },
  { title: "Photo Editor Pro", developer: "InShot Inc.", iconUrl: "/icons/apps/29_editor.svg", rating: 4.6, downloads: "100M+", category: "Photography", size: "45 MB", version: "1.45.0" },
  { title: "Music Player - MP3 Player", developer: "Music Hero", iconUrl: "/icons/apps/30_music.svg", rating: 4.5, downloads: "500M+", category: "Entertainment", size: "18 MB", version: "6.9.0" },
  { title: "Podcast Addict", developer: "Xavier Guillemane", iconUrl: "/icons/apps/31_podcast.svg", rating: 4.7, downloads: "10M+", category: "Entertainment", size: "20 MB", version: "2023.8" },
  { title: "TuneIn Radio - Live Radio", developer: "TuneIn Inc.", iconUrl: "/icons/apps/32_radio.svg", rating: 4.4, downloads: "100M+", category: "Entertainment", size: "35 MB", version: "31.5.1" },
  { title: "Google News", developer: "Google LLC", iconUrl: "/icons/apps/33_news.svg", rating: 4.2, downloads: "1B+", category: "News", size: "25 MB", version: "5.82.0" },
  { title: "Weather - Live Forecast", developer: "Weather Widget Theme", iconUrl: "/icons/apps/34_weather.svg", rating: 4.5, downloads: "100M+", category: "Weather", size: "22 MB", version: "2.8.0" },
  { title: "Clock - Alarm & Timer", developer: "Google LLC", iconUrl: "/icons/apps/35_clock.svg", rating: 4.4, downloads: "1B+", category: "Tools", size: "12 MB", version: "7.4" },
  { title: "Alarm Clock Xtreme", developer: "AVG Labs", iconUrl: "/icons/apps/36_alarm.svg", rating: 4.5, downloads: "50M+", category: "Tools", size: "15 MB", version: "7.15.0" },
  { title: "Timer Plus - Workout Timer", developer: "Flavor Tech", iconUrl: "/icons/apps/37_timer.svg", rating: 4.6, downloads: "10M+", category: "Health & Fitness", size: "8 MB", version: "3.2.1" },
  { title: "Google Keep - Notes", developer: "Google LLC", iconUrl: "/icons/apps/38_notes.svg", rating: 4.4, downloads: "1B+", category: "Productivity", size: "20 MB", version: "5.23.462" },
  { title: "Google Docs", developer: "Google LLC", iconUrl: "/icons/apps/39_docs.svg", rating: 4.3, downloads: "1B+", category: "Productivity", size: "95 MB", version: "1.23.482" },
  { title: "Google Sheets", developer: "Google LLC", iconUrl: "/icons/apps/40_sheets.svg", rating: 4.3, downloads: "1B+", category: "Productivity", size: "80 MB", version: "1.23.482" },
  { title: "Google Slides", developer: "Google LLC", iconUrl: "/icons/apps/41_slides.svg", rating: 4.3, downloads: "500M+", category: "Productivity", size: "75 MB", version: "1.23.482" },
  { title: "Adobe Acrobat Reader", developer: "Adobe", iconUrl: "/icons/apps/42_pdf.svg", rating: 4.5, downloads: "500M+", category: "Productivity", size: "85 MB", version: "23.10.0" },
  { title: "CamScanner - PDF Scanner", developer: "CamSoft Information", iconUrl: "/icons/apps/43_scanner.svg", rating: 4.6, downloads: "500M+", category: "Productivity", size: "45 MB", version: "6.56.0" },
  { title: "Google Translate", developer: "Google LLC", iconUrl: "/icons/apps/44_translate.svg", rating: 4.5, downloads: "1B+", category: "Tools", size: "35 MB", version: "7.12.0" },
  { title: "Google Maps", developer: "Google LLC", iconUrl: "/icons/apps/45_maps.svg", rating: 4.3, downloads: "10B+", category: "Travel", size: "95 MB", version: "11.112.0" },
  { title: "Uber - Request a ride", developer: "Uber Technologies", iconUrl: "/icons/apps/46_uber.svg", rating: 4.1, downloads: "500M+", category: "Travel", size: "115 MB", version: "4.495.10001" },
  { title: "Lyft - Rideshare, Bikes", developer: "Lyft, Inc.", iconUrl: "/icons/apps/47_lyft.svg", rating: 4.2, downloads: "50M+", category: "Travel", size: "95 MB", version: "9.12.3" },
  { title: "Airbnb - Vacation Rentals", developer: "Airbnb, Inc.", iconUrl: "/icons/apps/48_airbnb.svg", rating: 4.6, downloads: "100M+", category: "Travel", size: "85 MB", version: "23.50" },
  { title: "Booking.com - Hotels", developer: "Booking.com", iconUrl: "/icons/apps/49_booking.svg", rating: 4.5, downloads: "500M+", category: "Travel", size: "75 MB", version: "38.5" },
  { title: "Expedia - Hotels & Flights", developer: "Expedia Group", iconUrl: "/icons/apps/50_expedia.svg", rating: 4.4, downloads: "50M+", category: "Travel", size: "65 MB", version: "23.45" },
];

// ==================== GAMES (50) ====================
const games = [
  { title: "PUBG Mobile", developer: "Level Infinite", iconUrl: "/icons/games/01_pubg.svg", rating: 4.3, downloads: "1B+", category: "Games", size: "800 MB", version: "2.9.0" },
  { title: "Fortnite", developer: "Epic Games", iconUrl: "/icons/games/02_fortnite.svg", rating: 4.4, downloads: "500M+", category: "Games", size: "1.2 GB", version: "28.10" },
  { title: "Minecraft", developer: "Mojang", iconUrl: "/icons/games/03_minecraft.svg", rating: 4.6, downloads: "50M+", category: "Games", size: "600 MB", version: "1.20.73" },
  { title: "Roblox", developer: "Roblox Corporation", iconUrl: "/icons/games/04_roblox.svg", rating: 4.4, downloads: "500M+", category: "Games", size: "185 MB", version: "2.605.660" },
  { title: "Genshin Impact", developer: "miHoYo", iconUrl: "/icons/games/05_genshin.svg", rating: 4.5, downloads: "100M+", category: "Games", size: "400 MB", version: "4.3.0" },
  { title: "Call of Duty: Mobile", developer: "Activision Publishing", iconUrl: "/icons/games/06_codm.svg", rating: 4.4, downloads: "500M+", category: "Games", size: "2.1 GB", version: "1.0.40" },
  { title: "Free Fire MAX", developer: "Garena International", iconUrl: "/icons/games/07_freefire.svg", rating: 4.2, downloads: "500M+", category: "Games", size: "1.1 GB", version: "2.103.1" },
  { title: "Clash of Clans", developer: "Supercell", iconUrl: "/icons/games/08_clash.svg", rating: 4.6, downloads: "500M+", category: "Games", size: "250 MB", version: "15.547.8" },
  { title: "Brawl Stars", developer: "Supercell", iconUrl: "/icons/games/09_brawl.svg", rating: 4.3, downloads: "500M+", category: "Games", size: "390 MB", version: "54.272" },
  { title: "Clash Royale", developer: "Supercell", iconUrl: "/icons/games/10_royale.svg", rating: 4.3, downloads: "500M+", category: "Games", size: "220 MB", version: "3.3186.7" },
  { title: "Mobile Legends: Bang Bang", developer: "Moonton", iconUrl: "/icons/games/11_legends.svg", rating: 4.2, downloads: "500M+", category: "Games", size: "180 MB", version: "1.8.26" },
  { title: "Arena of Valor", developer: "Level Infinite", iconUrl: "/icons/games/12_arena.svg", rating: 4.1, downloads: "100M+", category: "Games", size: "2.5 GB", version: "1.53.1.2" },
  { title: "Puzzle Master 3D", developer: "Puzzle Games Inc.", iconUrl: "/icons/games/13_puzzle.svg", rating: 4.5, downloads: "50M+", category: "Games", size: "85 MB", version: "2.8.0" },
  { title: "Candy Crush Saga", developer: "King", iconUrl: "/icons/games/14_candy.svg", rating: 4.6, downloads: "1B+", category: "Games", size: "95 MB", version: "1.267.0.2" },
  { title: "Bubble Shooter Legend", developer: "BitMango", iconUrl: "/icons/games/15_bubble.svg", rating: 4.4, downloads: "100M+", category: "Games", size: "65 MB", version: "2.45.0" },
  { title: "Match Masters - PvP Match 3", developer: "Candivore", iconUrl: "/icons/games/16_match3.svg", rating: 4.5, downloads: "50M+", category: "Games", size: "145 MB", version: "4.510" },
  { title: "Solitaire - Classic Card Game", developer: "MobilityWare", iconUrl: "/icons/games/17_solitaire.svg", rating: 4.7, downloads: "100M+", category: "Games", size: "55 MB", version: "8.3.0" },
  { title: "Chess - Play & Learn", developer: "Chess.com", iconUrl: "/icons/games/18_chess.svg", rating: 4.6, downloads: "100M+", category: "Games", size: "75 MB", version: "4.6.18" },
  { title: "Poker Night - Texas Holdem", developer: "Playtika", iconUrl: "/icons/games/19_poker.svg", rating: 4.3, downloads: "50M+", category: "Games", size: "125 MB", version: "2.0.8" },
  { title: "Slots Casino - Jackpot Mania", developer: "Huuuge Games", iconUrl: "/icons/games/20_slots.svg", rating: 4.4, downloads: "100M+", category: "Games", size: "185 MB", version: "3.50.0" },
  { title: "Real Racing 3", developer: "Electronic Arts", iconUrl: "/icons/games/21_racing.svg", rating: 4.5, downloads: "500M+", category: "Games", size: "1.8 GB", version: "12.3.1" },
  { title: "CarX Drift Racing 2", developer: "CarX Technologies", iconUrl: "/icons/games/22_drift.svg", rating: 4.4, downloads: "100M+", category: "Games", size: "650 MB", version: "1.29.1" },
  { title: "Need for Speed No Limits", developer: "Electronic Arts", iconUrl: "/icons/games/23_speed.svg", rating: 4.3, downloads: "100M+", category: "Games", size: "155 MB", version: "7.1.0" },
  { title: "Traffic Rider", developer: "Soner Kara", iconUrl: "/icons/games/24_moto.svg", rating: 4.5, downloads: "500M+", category: "Games", size: "105 MB", version: "1.98" },
  { title: "Bike Race - Motorcycle Games", developer: "Top Free Games", iconUrl: "/icons/games/25_bike.svg", rating: 4.3, downloads: "100M+", category: "Games", size: "55 MB", version: "8.3.3" },
  { title: "Subway Surfers", developer: "SYBO Games", iconUrl: "/icons/games/26_runner.svg", rating: 4.5, downloads: "1B+", category: "Games", size: "165 MB", version: "3.16.0" },
  { title: "Jump King Mobile", developer: "Nexile", iconUrl: "/icons/games/27_jump.svg", rating: 4.2, downloads: "10M+", category: "Games", size: "75 MB", version: "1.0.8" },
  { title: "Ninja Must Die", developer: "Pandada Games", iconUrl: "/icons/games/28_ninja.svg", rating: 4.6, downloads: "50M+", category: "Games", size: "850 MB", version: "1.0.68" },
  { title: "Shadow Fight 4: Arena", developer: "Nekki", iconUrl: "/icons/games/29_samurai.svg", rating: 4.3, downloads: "50M+", category: "Games", size: "1.1 GB", version: "1.8.10" },
  { title: "Knight's Edge", developer: "Lightfox Games", iconUrl: "/icons/games/30_knight.svg", rating: 4.4, downloads: "10M+", category: "Games", size: "450 MB", version: "1.12.0" },
  { title: "Dungeon Hunter 6", developer: "Gameloft SE", iconUrl: "/icons/games/31_warrior.svg", rating: 4.2, downloads: "10M+", category: "Games", size: "1.5 GB", version: "1.4.10" },
  { title: "Archero", developer: "Habby", iconUrl: "/icons/games/32_archer.svg", rating: 4.3, downloads: "100M+", category: "Games", size: "285 MB", version: "4.10.1" },
  { title: "Zombie Gunship Survival", developer: "Flaregames", iconUrl: "/icons/games/33_zombie.svg", rating: 4.4, downloads: "10M+", category: "Games", size: "95 MB", version: "1.6.68" },
  { title: "Last Day on Earth: Survival", developer: "Kefir!", iconUrl: "/icons/games/34_survival.svg", rating: 4.3, downloads: "100M+", category: "Games", size: "785 MB", version: "1.21.3" },
  { title: "Craft World - Block Craft", developer: "Tellurion Mobile", iconUrl: "/icons/games/35_craft.svg", rating: 4.2, downloads: "50M+", category: "Games", size: "145 MB", version: "3.8.5" },
  { title: "Block Craft 3D", developer: "Fun Games For Free", iconUrl: "/icons/games/36_build.svg", rating: 4.4, downloads: "100M+", category: "Games", size: "125 MB", version: "2.17.8" },
  { title: "Tower Defense King", developer: "tower.defense.games", iconUrl: "/icons/games/37_tower.svg", rating: 4.3, downloads: "10M+", category: "Games", size: "95 MB", version: "1.5.4" },
  { title: "Defense Zone 3", developer: "Artem Kotov", iconUrl: "/icons/games/38_defense.svg", rating: 4.5, downloads: "10M+", category: "Games", size: "75 MB", version: "1.4.5" },
  { title: "Rise of Kingdoms", developer: "Lilith Games", iconUrl: "/icons/games/39_strategy.svg", rating: 4.4, downloads: "50M+", category: "Games", size: "1.2 GB", version: "1.0.79.15" },
  { title: "Age of Empires Mobile", developer: "Level Infinite", iconUrl: "/icons/games/40_empire.svg", rating: 4.3, downloads: "10M+", category: "Games", size: "1.8 GB", version: "1.2.85" },
  { title: "Lords Mobile: Kingdom Wars", developer: "IGG.COM", iconUrl: "/icons/games/41_kingdom.svg", rating: 4.2, downloads: "100M+", category: "Games", size: "135 MB", version: "2.115" },
  { title: "Hay Day - Farm Game", developer: "Supercell", iconUrl: "/icons/games/42_farm.svg", rating: 4.5, downloads: "100M+", category: "Games", size: "185 MB", version: "1.59.192" },
  { title: "SimCity BuildIt", developer: "Electronic Arts", iconUrl: "/icons/games/43_city.svg", rating: 4.3, downloads: "100M+", category: "Games", size: "155 MB", version: "1.52.2" },
  { title: "Idle Miner Tycoon", developer: "Kolibri Games", iconUrl: "/icons/games/44_tycoon.svg", rating: 4.5, downloads: "100M+", category: "Games", size: "185 MB", version: "4.53.0" },
  { title: "Idle Heroes", developer: "DHGAMES", iconUrl: "/icons/games/45_idle.svg", rating: 4.3, downloads: "50M+", category: "Games", size: "365 MB", version: "1.32.0" },
  { title: "Cookie Clicker", developer: "Orteil", iconUrl: "/icons/games/46_clicker.svg", rating: 4.6, downloads: "10M+", category: "Games", size: "45 MB", version: "1.0.0" },
  { title: "Merge Dragons!", developer: "Gram Games", iconUrl: "/icons/games/47_merge.svg", rating: 4.4, downloads: "50M+", category: "Games", size: "195 MB", version: "10.8.0" },
  { title: "Wordscapes", developer: "PeopleFun", iconUrl: "/icons/games/48_word.svg", rating: 4.7, downloads: "100M+", category: "Games", size: "85 MB", version: "2.3.0" },
  { title: "Trivia Crack", developer: "Etermax", iconUrl: "/icons/games/49_trivia.svg", rating: 4.5, downloads: "100M+", category: "Games", size: "95 MB", version: "3.205.0" },
  { title: "QuizUp - Trivia Quiz Game", developer: "Glu Mobile", iconUrl: "/icons/games/50_quiz.svg", rating: 4.3, downloads: "50M+", category: "Games", size: "75 MB", version: "4.2.0" },
];

// ==================== KIDS (50) ====================
const kids = [
  { title: "ABC Kids - Tracing & Phonics", developer: "RV AppStudios", iconUrl: "/icons/kids/01_abc.svg", rating: 4.6, downloads: "100M+", category: "Kids", size: "45 MB", version: "1.9.3" },
  { title: "123 Numbers - Count & Tracing", developer: "RV AppStudios", iconUrl: "/icons/kids/02_numbers.svg", rating: 4.5, downloads: "50M+", category: "Kids", size: "35 MB", version: "2.3.0" },
  { title: "Shapes & Colors for Toddlers", developer: "Bimi Boo Kids", iconUrl: "/icons/kids/03_shapes.svg", rating: 4.7, downloads: "10M+", category: "Kids", size: "55 MB", version: "1.5.0" },
  { title: "Colors Learning for Kids", developer: "GoKids!", iconUrl: "/icons/kids/04_colors.svg", rating: 4.4, downloads: "50M+", category: "Kids", size: "42 MB", version: "3.2.1" },
  { title: "Animal Sounds for Kids", developer: "Fisher-Price", iconUrl: "/icons/kids/05_animals.svg", rating: 4.5, downloads: "100M+", category: "Kids", size: "65 MB", version: "2.8.0" },
  { title: "Dinosaur Games for Kids", developer: "Yateland", iconUrl: "/icons/kids/06_dinosaur.svg", rating: 4.6, downloads: "50M+", category: "Kids", size: "85 MB", version: "1.12.0" },
  { title: "My Virtual Pet Shop", developer: "Frenzoo", iconUrl: "/icons/kids/07_pets.svg", rating: 4.3, downloads: "50M+", category: "Kids", size: "95 MB", version: "2.5.3" },
  { title: "Farm Animals for Toddlers", developer: "Bimi Boo Kids", iconUrl: "/icons/kids/08_farm.svg", rating: 4.6, downloads: "10M+", category: "Kids", size: "48 MB", version: "1.3.2" },
  { title: "Ocean Adventure - Sea Games", developer: "Yateland", iconUrl: "/icons/kids/09_ocean.svg", rating: 4.5, downloads: "10M+", category: "Kids", size: "75 MB", version: "1.8.0" },
  { title: "Space Adventure for Kids", developer: "TabTale", iconUrl: "/icons/kids/10_space.svg", rating: 4.4, downloads: "50M+", category: "Kids", size: "115 MB", version: "2.1.0" },
  { title: "Princess Dress Up Games", developer: "CrazyLabs LTD", iconUrl: "/icons/kids/11_princess.svg", rating: 4.3, downloads: "100M+", category: "Kids", size: "125 MB", version: "3.4.5" },
  { title: "Fairy Tales - Story Time", developer: "Itutu Games", iconUrl: "/icons/kids/12_fairy.svg", rating: 4.5, downloads: "10M+", category: "Kids", size: "85 MB", version: "1.6.0" },
  { title: "Unicorn Dreams - Magic World", developer: "TutoTOONS", iconUrl: "/icons/kids/13_unicorn.svg", rating: 4.4, downloads: "50M+", category: "Kids", size: "145 MB", version: "2.2.0" },
  { title: "Dragon Land Adventure", developer: "Socialpoint", iconUrl: "/icons/kids/14_dragon.svg", rating: 4.5, downloads: "50M+", category: "Kids", size: "165 MB", version: "3.8.2" },
  { title: "Monster Friends - Pet Game", developer: "Crazy Labs", iconUrl: "/icons/kids/15_monster.svg", rating: 4.3, downloads: "10M+", category: "Kids", size: "95 MB", version: "1.4.0" },
  { title: "Robot Factory - Build & Play", developer: "Tinybop Inc.", iconUrl: "/icons/kids/16_robot.svg", rating: 4.6, downloads: "5M+", category: "Kids", size: "185 MB", version: "2.0.3" },
  { title: "Car Games for Toddlers", developer: "GoKids!", iconUrl: "/icons/kids/17_car.svg", rating: 4.4, downloads: "50M+", category: "Kids", size: "65 MB", version: "3.1.0" },
  { title: "Train Driver - Kids Games", developer: "Yateland", iconUrl: "/icons/kids/18_train.svg", rating: 4.5, downloads: "50M+", category: "Kids", size: "75 MB", version: "1.9.5" },
  { title: "Airplane Games for Kids", developer: "GoKids!", iconUrl: "/icons/kids/19_plane.svg", rating: 4.3, downloads: "10M+", category: "Kids", size: "55 MB", version: "2.3.0" },
  { title: "Boat Adventure - Kids Game", developer: "Yateland", iconUrl: "/icons/kids/20_boat.svg", rating: 4.4, downloads: "10M+", category: "Kids", size: "68 MB", version: "1.5.2" },
  { title: "Kids Music Instruments", developer: "123 Kids Fun Apps", iconUrl: "/icons/kids/21_music.svg", rating: 4.5, downloads: "50M+", category: "Kids", size: "45 MB", version: "2.8.0" },
  { title: "Piano Kids - Music & Songs", developer: "Orange Studios Games", iconUrl: "/icons/kids/22_piano.svg", rating: 4.6, downloads: "100M+", category: "Kids", size: "55 MB", version: "3.1.0" },
  { title: "Drums for Kids - Music Game", developer: "Bimi Boo Kids", iconUrl: "/icons/kids/23_drums.svg", rating: 4.4, downloads: "10M+", category: "Kids", size: "35 MB", version: "1.2.0" },
  { title: "Dance Party - Kids Music", developer: "TabTale", iconUrl: "/icons/kids/24_dance.svg", rating: 4.3, downloads: "10M+", category: "Kids", size: "125 MB", version: "2.0.5" },
  { title: "Sing Along - Nursery Rhymes", developer: "KidloLand", iconUrl: "/icons/kids/25_sing.svg", rating: 4.7, downloads: "10M+", category: "Kids", size: "95 MB", version: "2.5.0" },
  { title: "Painting Games for Kids", developer: "Bimi Boo Kids", iconUrl: "/icons/kids/26_paint.svg", rating: 4.5, downloads: "50M+", category: "Kids", size: "65 MB", version: "1.8.3" },
  { title: "Drawing for Kids - Doodle", developer: "Bini Bambini", iconUrl: "/icons/kids/27_draw.svg", rating: 4.6, downloads: "100M+", category: "Kids", size: "55 MB", version: "2.4.0" },
  { title: "Craft Studio for Kids", developer: "123 Kids Fun Apps", iconUrl: "/icons/kids/28_craft.svg", rating: 4.4, downloads: "10M+", category: "Kids", size: "75 MB", version: "1.6.0" },
  { title: "Puzzle Kids - Animals", developer: "RV AppStudios", iconUrl: "/icons/kids/29_puzzle.svg", rating: 4.5, downloads: "100M+", category: "Kids", size: "48 MB", version: "2.1.3" },
  { title: "Memory Game for Kids", developer: "Orange Studios Games", iconUrl: "/icons/kids/30_memory.svg", rating: 4.4, downloads: "50M+", category: "Kids", size: "35 MB", version: "3.0.0" },
  { title: "Bedtime Stories for Kids", developer: "Itutu Games", iconUrl: "/icons/kids/31_story.svg", rating: 4.6, downloads: "10M+", category: "Kids", size: "85 MB", version: "1.4.5" },
  { title: "Reading Eggs - Learn to Read", developer: "Blake eLearning", iconUrl: "/icons/kids/32_reading.svg", rating: 4.5, downloads: "5M+", category: "Kids", size: "125 MB", version: "2.2.0" },
  { title: "Writing Wizard - Kids ABC", developer: "L'Escapadou", iconUrl: "/icons/kids/33_writing.svg", rating: 4.7, downloads: "5M+", category: "Kids", size: "95 MB", version: "3.3.0" },
  { title: "Math Kids - Learning Game", developer: "RV AppStudios", iconUrl: "/icons/kids/34_math.svg", rating: 4.5, downloads: "50M+", category: "Kids", size: "42 MB", version: "1.6.0" },
  { title: "Science Games for Kids", developer: "Tinybop Inc.", iconUrl: "/icons/kids/35_science.svg", rating: 4.6, downloads: "10M+", category: "Kids", size: "155 MB", version: "2.1.0" },
  { title: "Coding for Kids - ScratchJr", developer: "MIT Media Lab", iconUrl: "/icons/kids/36_coding.svg", rating: 4.4, downloads: "10M+", category: "Kids", size: "145 MB", version: "1.2.9" },
  { title: "Nature Explorer for Kids", developer: "Tinybop Inc.", iconUrl: "/icons/kids/37_nature.svg", rating: 4.5, downloads: "5M+", category: "Kids", size: "175 MB", version: "1.8.0" },
  { title: "Garden Time - Growing Plants", developer: "Baby Panda Games", iconUrl: "/icons/kids/38_garden.svg", rating: 4.4, downloads: "50M+", category: "Kids", size: "85 MB", version: "2.3.5" },
  { title: "Cooking Games for Kids", developer: "TutoTOONS", iconUrl: "/icons/kids/39_cooking.svg", rating: 4.5, downloads: "100M+", category: "Kids", size: "115 MB", version: "3.5.0" },
  { title: "Baking Cupcakes - Kids Game", developer: "TabTale", iconUrl: "/icons/kids/40_baking.svg", rating: 4.3, downloads: "50M+", category: "Kids", size: "95 MB", version: "2.0.0" },
  { title: "Doctor Kids - Hospital Game", developer: "Bubadu", iconUrl: "/icons/kids/41_doctor.svg", rating: 4.4, downloads: "100M+", category: "Kids", size: "125 MB", version: "3.2.0" },
  { title: "Dentist Games - Teeth Doctor", developer: "CrazyLabs LTD", iconUrl: "/icons/kids/42_dentist.svg", rating: 4.3, downloads: "50M+", category: "Kids", size: "105 MB", version: "2.5.0" },
  { title: "Pet Doctor - Animal Hospital", developer: "TutoTOONS", iconUrl: "/icons/kids/43_vet.svg", rating: 4.5, downloads: "50M+", category: "Kids", size: "135 MB", version: "2.8.5" },
  { title: "Little Builder - Truck Games", developer: "Fox and Sheep", iconUrl: "/icons/kids/44_builder.svg", rating: 4.6, downloads: "10M+", category: "Kids", size: "95 MB", version: "1.5.0" },
  { title: "Fire Truck Games for Kids", developer: "GoKids!", iconUrl: "/icons/kids/45_firefighter.svg", rating: 4.4, downloads: "50M+", category: "Kids", size: "75 MB", version: "2.1.0" },
  { title: "Police Car Games for Kids", developer: "GoKids!", iconUrl: "/icons/kids/46_police.svg", rating: 4.3, downloads: "50M+", category: "Kids", size: "72 MB", version: "2.0.5" },
  { title: "Superhero Kids - Save World", developer: "TabTale", iconUrl: "/icons/kids/47_superhero.svg", rating: 4.5, downloads: "10M+", category: "Kids", size: "145 MB", version: "1.8.0" },
  { title: "Explorer World for Kids", developer: "Tinybop Inc.", iconUrl: "/icons/kids/48_explorer.svg", rating: 4.6, downloads: "5M+", category: "Kids", size: "165 MB", version: "2.0.0" },
  { title: "Sports Games for Kids", developer: "Bini Bambini", iconUrl: "/icons/kids/49_sports.svg", rating: 4.4, downloads: "10M+", category: "Kids", size: "85 MB", version: "1.7.0" },
  { title: "Kids Yoga - Fun Exercises", developer: "Cosmic Kids", iconUrl: "/icons/kids/50_yoga.svg", rating: 4.7, downloads: "5M+", category: "Kids", size: "95 MB", version: "2.3.0" },
];

// Combine all apps
const allApps = [
  ...apps.map(app => ({ ...app, description: `${app.title} - A top-rated ${app.category.toLowerCase()} app by ${app.developer}. Enjoy seamless experience with regular updates.` })),
  ...games.map(game => ({ ...game, description: `${game.title} - An exciting game by ${game.developer}. Experience thrilling gameplay with stunning graphics.` })),
  ...kids.map(kid => ({ ...kid, description: `${kid.title} - A safe and fun educational app for children by ${kid.developer}. Perfect for young learners!` })),
];

async function main() {
  console.log("Cleaning database...");
  await prisma.remoteInstallTask.deleteMany();
  await prisma.device.deleteMany();
  await prisma.review.deleteMany();
  await prisma.screenshot.deleteMany();
  await prisma.app.deleteMany();

  console.log(`Seeding ${allApps.length} apps...`);

  const createdApps: Record<string, string> = {};

  for (const [index, app] of allApps.entries()) {
    const screenshots = screenshotSets[index % screenshotSets.length];
    const reviewOffset = index % reviews.length;
    const reviewSet = Array.from({ length: 3 }, (_, i) => reviews[(reviewOffset + i) % reviews.length]);

    const createdApp = await prisma.app.create({
      data: {
        title: app.title,
        developer: app.developer,
        iconUrl: app.iconUrl,
        description: app.description,
        rating: app.rating,
        downloads: app.downloads,
        category: app.category,
        isInstalled: Math.random() > 0.85,
        size: app.size,
        version: app.version,
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        screenshots: { create: screenshots.map(url => ({ url })) },
        reviews: { create: reviewSet },
      },
    });

    createdApps[app.title] = createdApp.id;

    if ((index + 1) % 25 === 0) {
      console.log(`  Created ${index + 1}/${allApps.length} apps...`);
    }
  }

  console.log("Creating devices...");
  const devices = [
    { id: "oppo-find-x7", name: "OPPO Find X7 Ultra", platform: "Android", osVersion: "14", appVersion: "1.2.0", pushToken: "token-find-x7", isOnline: true, lastSeen: new Date() },
    { id: "oppo-reno-11", name: "OPPO Reno 11 Pro", platform: "Android", osVersion: "14", appVersion: "1.2.0", pushToken: "token-reno-11", isOnline: true, lastSeen: new Date(Date.now() - 1000 * 60 * 5) },
    { id: "pixel-8-pro", name: "Google Pixel 8 Pro", platform: "Android", osVersion: "14", appVersion: "1.1.5", pushToken: "token-pixel-8", isOnline: true, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
    { id: "samsung-s24", name: "Samsung Galaxy S24 Ultra", platform: "Android", osVersion: "14", appVersion: "1.1.8", pushToken: "token-s24", isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: "oneplus-12", name: "OnePlus 12", platform: "Android", osVersion: "14", appVersion: "1.2.0", pushToken: "token-oneplus", isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 6) },
  ];

  for (const device of devices) {
    await prisma.device.create({ data: device });
  }

  console.log("Creating install tasks...");
  const installTasks = [
    { deviceId: "oppo-find-x7", appTitle: "Spotify - Music & Podcasts", status: "COMPLETED", progress: 100 },
    { deviceId: "oppo-find-x7", appTitle: "PUBG Mobile", status: "COMPLETED", progress: 100 },
    { deviceId: "oppo-reno-11", appTitle: "Instagram", status: "IN_PROGRESS", progress: 68 },
    { deviceId: "pixel-8-pro", appTitle: "Minecraft", status: "IN_PROGRESS", progress: 45 },
    { deviceId: "samsung-s24", appTitle: "Netflix", status: "QUEUED", progress: 0 },
    { deviceId: "oneplus-12", appTitle: "ABC Kids - Tracing & Phonics", status: "QUEUED", progress: 0 },
  ];

  for (const task of installTasks) {
    const appId = createdApps[task.appTitle];
    if (appId) {
      await prisma.remoteInstallTask.create({
        data: {
          appId,
          deviceId: task.deviceId,
          status: task.status,
          progress: task.progress,
          message: task.status === "COMPLETED" ? "Installation successful" : task.status === "IN_PROGRESS" ? "Downloading..." : "Waiting for device",
          downloadUrl: `https://cdn.example.com/apps/${appId}.apk`,
          hash: `sha256-${appId.slice(0, 16)}`,
        },
      });
    }
  }

  console.log("\n✅ Seed completed successfully!");
  console.log(`   - Apps: ${allApps.length}`);
  console.log(`   - Devices: ${devices.length}`);
  console.log(`   - Install tasks: ${installTasks.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

function createPrismaClient() {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }
  return new PrismaClient();
}

const prisma = createPrismaClient();

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
  { title: "Spotify: Music and Podcasts", developer: "Spotify AB", iconUrl: "https://play-lh.googleusercontent.com/7ynvVIRdhJNAngCg_GI7i8TtH8BqkJYmffeUHsG-mJOdzt1XLvGmbsKuc5Q1SInBjDKN=w512-h512", rating: 4.3, downloads: "1,000,000,000+", category: "Entertainment", size: "50 MB", version: "VARY" },
  { title: "Netflix", developer: "Netflix, Inc.", iconUrl: "https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI=w512-h512", rating: 3.9, downloads: "1,000,000,000+", category: "Entertainment", size: "50 MB", version: "VARY" },
  { title: "YouTube", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/6am0i3walYwNLc08QOOhRJttQENNGkhlKajXSERf3JnPVRQczIyxw2w3DxeMRTOSdsY=w512-h512", rating: 3.9, downloads: "10,000,000,000+", category: "Entertainment", size: "50 MB", version: "VARY" },
  { title: "X", developer: "X Corp.", iconUrl: "https://play-lh.googleusercontent.com/A-Rnrh0J7iKmABskTonqFAANRLGTGUg_nuE4PEMYwJavL3nPt5uWsU2WO_DSgV_mOOM=w512-h512", rating: 3.7, downloads: "1,000,000,000+", category: "Social", size: "50 MB", version: "11.47.0-release.0" },
  { title: "Facebook", developer: "Meta Platforms, Inc.", iconUrl: "https://play-lh.googleusercontent.com/KCMTYuiTrKom4Vyf0G4foetVOwhKWzNbHWumV73IXexAIy5TTgZipL52WTt8ICL-oIo=w512-h512", rating: 4.6, downloads: "10,000,000,000+", category: "Social", size: "50 MB", version: "VARY" },
  { title: "Instagram", developer: "Instagram", iconUrl: "https://play-lh.googleusercontent.com/VRMWkE5p3CkWhJs6nv-9ZsLAs1QOg5ob1_3qg-rckwYW7yp1fMrYZqnEFpk0IoVP4LM=w512-h512", rating: 3.9, downloads: "5,000,000,000+", category: "Social", size: "50 MB", version: "VARY" },
  { title: "WhatsApp Messenger", developer: "WhatsApp LLC", iconUrl: "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=w512-h512", rating: 4.5, downloads: "10,000,000,000+", category: "Social", size: "50 MB", version: "VARY" },
  { title: "Telegram", developer: "Telegram FZ-LLC", iconUrl: "https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q=w512-h512", rating: 4, downloads: "1,000,000,000+", category: "Social", size: "50 MB", version: "12.2.9" },
  { title: "Snapchat", developer: "Snap Inc", iconUrl: "https://play-lh.googleusercontent.com/KxeSAjPTKliCErbivNiXrd6cTwfbqUJcbSRPe_IBVK_YmwckfMRS1VIHz-5cgT09yMo=w512-h512", rating: 4.1, downloads: "1,000,000,000+", category: "Social", size: "50 MB", version: "13.71.0.51" },
  { title: "TikTok - Videos, Shop & LIVE", developer: "TikTok Pte. Ltd.", iconUrl: "https://play-lh.googleusercontent.com/BmUViDVOKNJe0GYJe22hsr7juFndRVbvr1fGmHGXqHfJjNAXjd26bfuGRQpVrpJ6YbA=w512-h512", rating: 4.1, downloads: "1,000,000,000+", category: "Entertainment", size: "50 MB", version: "VARY" },
  { title: "Discord - Talk, Play, Hang Out", developer: "Discord Inc.", iconUrl: "https://play-lh.googleusercontent.com/0oO5sAneb9lJP6l8c6DH4aj6f85qNpplQVHmPmbbBxAukDnlO7DarDW0b-kEIHa8SQ=w512-h512", rating: 4.3, downloads: "500,000,000+", category: "Social", size: "50 MB", version: "308.11 - Stable" },
  { title: "Slack", developer: "SLACK TECHNOLOGIES L.L.C.", iconUrl: "https://play-lh.googleusercontent.com/mzJpTCsTW_FuR6YqOPaLHrSEVCSJuXzCljdxnCKhVZMcu6EESZBQTCHxMh8slVtnKqo=w512-h512", rating: 4.7, downloads: "10,000,000+", category: "Productivity", size: "50 MB", version: "25.12.20.0" },
  { title: "Zoom Workplace", developer: "zoom.com", iconUrl: "https://play-lh.googleusercontent.com/yZsmiNjmji3ZoOuLthoVvptLB9cZ0vCmitcky4OUXNcEFV3IEQkrBD2uu5kuWRF5_ERA=w512-h512", rating: 4.1, downloads: "1,000,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Microsoft Teams", developer: "Microsoft Corporation", iconUrl: "https://play-lh.googleusercontent.com/jKU64njy8urP89V1O63eJxMtvWjDGETPlHVIhDv9WZAYzsSxRWyWZkUlBJZj_HbkHA=w512-h512", rating: 4.6, downloads: "500,000,000+", category: "Productivity", size: "50 MB", version: "1416/1.0.0.2025204802" },
  { title: "Notion: Notes, Tasks, AI", developer: "Notion Labs, Inc.", iconUrl: "https://play-lh.googleusercontent.com/vaxxIC1qaXOd1q1hmL7c66N-Mp4LXuQIuBZGM0dPIbwmyWcJAXbhIIZ8hNBWvar54c_j=w512-h512", rating: 4.7, downloads: "10,000,000+", category: "Productivity", size: "50 MB", version: "0.6.3486" },
  { title: "Evernote - Note Organizer", developer: "Evernote Corporation", iconUrl: "https://play-lh.googleusercontent.com/dVQlfnQ_Fp-wNfKv2eI9XxbLymV6oGW_0ywIw3pxhYyKhjC0Lk8y6Ru_-sUc1fq2akADzAN7QWn8nPvcw6Ck=w512-h512", rating: 3.5, downloads: "100,000,000+", category: "Productivity", size: "50 MB", version: "10.166.2" },
  { title: "Trello: Manage Team Projects", developer: "Atlassian", iconUrl: "https://play-lh.googleusercontent.com/Tt-6ZaQDUAjfSNSeLz4XyYkPsEQfVVp0lBtwrnuyqubhCna0LKu5OZxKgegBJIrEhz8=w512-h512", rating: 4, downloads: "10,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Asana: Work Management", developer: "Asana, Inc.", iconUrl: "https://play-lh.googleusercontent.com/SWbS8z3NqFVHCEQc_6l-ZDdDj5qPGrWSK8hEWRSPHYm9s8958y6nTnoLolVHXlgKfXw=w512-h512", rating: 4, downloads: "5,000,000+", category: "Productivity", size: "50 MB", version: "8.75.5" },
  { title: "Todoist: Planner & Calendar", developer: "Doist Inc.", iconUrl: "https://play-lh.googleusercontent.com/GK0SwEBVqlFBpRkPjY6y_1go6E6xZzAN0Ivzfgbuf28J4TTOoOsgWnqR4oJ_RhIhsg=w512-h512", rating: 4.6, downloads: "10,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Google Calendar", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/_bh6XK3B7TAk7kBXC1GHC0j9eS9cw9wQo2K7fiP7FDGAQlcOqgUPT2lx3WgZ0JlOJh8=w512-h512", rating: 4.6, downloads: "5,000,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Gmail", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/KSuaRLiI_FlDP8cM4MzJ23ml3og5Hxb9AapaGTMZ2GgR103mvJ3AAnoOFz1yheeQBBI=w512-h512", rating: 4.1, downloads: "10,000,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Microsoft Outlook", developer: "Microsoft Corporation", iconUrl: "https://play-lh.googleusercontent.com/cQ6W3fn_i56tK1PDQZlKvpuggupXR-kGyzwCtF1vYw-wK9FS3YDVUTnpfEvpbWXXuqH6aJ1JRD_t5bfAyCD4=w512-h512", rating: 4.4, downloads: "1,000,000,000+", category: "Productivity", size: "50 MB", version: "5.2547.0" },
  { title: "Google Drive", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/t-juVwXA8lDAk8uQ2L6d6K83jpgQoqmK1icB_l9yvhIAQ2QT_1XbRwg5IpY08906qEw=w512-h512", rating: 4.3, downloads: "10,000,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Dropbox: Secure Cloud Storage", developer: "Dropbox, Inc.", iconUrl: "https://play-lh.googleusercontent.com/b1-MIBjlMD9kvl0Okeglm9BL9ejRpOXMio303W0tiLb8Ul5WuVzBDoDKgGRcALOsCdw=w512-h512", rating: 4.4, downloads: "1,000,000,000+", category: "Productivity", size: "50 MB", version: "454.2.2" },
  { title: "Microsoft OneDrive", developer: "Microsoft Corporation", iconUrl: "https://play-lh.googleusercontent.com/pkzkr91OWFffdDGZ9706Ev2lxjM1pMizefY__r8JkCAtNVO-hmaMG2Qfx9ngpu7V7K4Yx_E7csAMl6fP7dGNS28=w512-h512", rating: 4.6, downloads: "5,000,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Google Photos", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/y1yV7oGqfPvaEiA2-wGxj54g6pznm_dkWOISrn_ZuamPO-EsSwJpePLX1eHkDpEyrhk=w512-h512", rating: 4.4, downloads: "10,000,000,000+", category: "Photography", size: "50 MB", version: "VARY" },
  { title: "Snapseed", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/Rilq4obCk7XIl2Pjb8XT-Ydh_aI3hBNeFwro9fFXrIAuC-zPxCZ4feE4rx5fZ3jHNLw=w512-h512", rating: 4, downloads: "100,000,000+", category: "Photography", size: "50 MB", version: "VARY" },
  { title: "VSCO: Photo Editor", developer: "VSCO", iconUrl: "https://play-lh.googleusercontent.com/RdCklOFg3SLN5QF8OR7cU-5bs1ESYo_pqGYrK2ena3XZDcrLOpjf7vLtNQELOR7Uo4MH=w512-h512", rating: 3.5, downloads: "100,000,000+", category: "Photography", size: "50 MB", version: "444.2" },
  { title: "Lightroom Photo & Video Editor", developer: "Adobe", iconUrl: "https://play-lh.googleusercontent.com/ALv_YzwUQTXc17qvu2oy7JTl8Qn-zm22M4FoZKVv2Ru541nDa2EltKPSlv_KyQGacLdpHLotR9Z98bamyEd9rKc=w512-h512", rating: 4.6, downloads: "100,000,000+", category: "Photography", size: "50 MB", version: "VARY" },
  { title: "Pinterest", developer: "Pinterest", iconUrl: "https://play-lh.googleusercontent.com/6CFQQ0b9r5fzF1v6f0gIirWsOGL7sGWkJifuUQxxhbCMcBx5aSG_cNXpjDKDn5c1jwjq=w512-h512", rating: 4.4, downloads: "1,000,000,000+", category: "Social", size: "50 MB", version: "VARY" },
  { title: "Podcast Addict: Podcast player", developer: "Xavier Guillemane - Podcast & Radio Addict", iconUrl: "https://play-lh.googleusercontent.com/m6FeLOkUfP8qTZNXKFSSI8_exI-SlGJRcIArl3gRm3-VninL7l1RdYlPkkf2CfbBnA=w512-h512", rating: 4.6, downloads: "10,000,000+", category: "Entertainment", size: "50 MB", version: "VARY" },
  { title: "Spotify for Artists", developer: "Spotify AB", iconUrl: "https://play-lh.googleusercontent.com/2s8CbkJv3_SrQpreioheDR6tVDMRRVSuAi_DpSctxmZrB4bKS_gSBZSi4dxfDScCgQ=w512-h512", rating: 3.6, downloads: "5,000,000+", category: "Entertainment", size: "50 MB", version: "2.2.16.2135" },
  { title: "Google News - Daily Headlines", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/b3MqZswO8F7j3lcdH01kxzaeHa7vUndy7ma_JwdM_j_Vpj8LKZcKt0HmpORQ7CKF2A=w512-h512", rating: 4, downloads: "1,000,000,000+", category: "News", size: "50 MB", version: "VARY" },
  { title: "Flipboard:Your Social Magazine", developer: "Flipboard", iconUrl: "https://play-lh.googleusercontent.com/Z5WroTW4KmTB3mvUhZMLwgFD2VymNypnEVVxoueXPPCKEFrnUAiZVl0684t1RFEOPqzB=w512-h512", rating: 3.5, downloads: "500,000,000+", category: "News", size: "50 MB", version: "4.3.40" },
  { title: "Clock", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/k-K6mdmZJZrJiuMJCHILReDGjMl_2ljzFIz3QLULfKL1q0tWtTcAkc0RDsjg9QEuXYw=w512-h512", rating: 3.7, downloads: "1,000,000,000+", category: "Tools", size: "50 MB", version: "VARY" },
  { title: "Calculator", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/POgn4x_Jrz18VxrjbZC88ijwZJwmOjs2flX1KC0Kz7IF1oncFoKOMsWfFKntJjc20BRJ=w512-h512", rating: 4.4, downloads: "1,000,000,000+", category: "Tools", size: "50 MB", version: "9.0 (827797324)" },
  { title: "Google Keep - Notes and lists", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/9bJoeaPbGTB8Tz_h4N-p-6ReRd8vSS-frZb2tmJulaGIoTKElKj3zpmcFJvnS96ANZP5=w512-h512", rating: 4.7, downloads: "1,000,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Google Docs", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/emmbClh_hm0WpWZqJ0X59B8Pz1mKoB9HVLkYMktxhGE6_-30SdGoa-BmYW73RJ8MGZQ=w512-h512", rating: 4.2, downloads: "1,000,000,000+", category: "Productivity", size: "50 MB", version: "1.25.491.01.90" },
  { title: "Google Sheets", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/keE2gN0Hqh8-Tsf_RYZ_-yS2uo6ToqYVyRBv_UZaLXsgeeHBd2YPcEUWEF4DEtfGyb1h=w512-h512", rating: 4.3, downloads: "1,000,000,000+", category: "Productivity", size: "50 MB", version: "1.25.491.01.90" },
  { title: "Google Slides", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/DG-zbXPr8LItYD8F2nD4aR_SK_jpkipLBK77YWY-F0cdJt67VFgCHZtRtjsakzTw3EM=w512-h512", rating: 4, downloads: "1,000,000,000+", category: "Productivity", size: "50 MB", version: "1.25.491.01.90" },
  { title: "Adobe Acrobat Reader: Edit PDF", developer: "Adobe", iconUrl: "https://play-lh.googleusercontent.com/BkRfMfIRPR9hUnmIYGDgHHKjow-g18-ouP6B2ko__VnyUHSi1spcc78UtZ4sVUtBH4g=w512-h512", rating: 4.5, downloads: "500,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Microsoft Word: Edit Documents", developer: "Microsoft Corporation", iconUrl: "https://play-lh.googleusercontent.com/FRNCqOBET5SQO_mtuKLb1f9Y9kVvU3wsQ9Hqni1S2jteiglIJLRdZ10XMe0VYb1gQJXM3OVa7uxxfny_wyOO-g=w512-h512", rating: 4.8, downloads: "1,000,000,000+", category: "Productivity", size: "50 MB", version: "VARY" },
  { title: "Google Translate", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/ZrNeuKthBirZN7rrXPN1JmUbaG8ICy3kZSHt-WgSnREsJzo2txzCzjIoChlevMIQEA=w512-h512", rating: 4.3, downloads: "1,000,000,000+", category: "Tools", size: "50 MB", version: "VARY" },
  { title: "Google Maps", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/Kf8WTct65hFJxBUDm5E-EpYsiDoLQiGGbnuyP6HBNax43YShXti9THPon1YKB6zPYpA=w512-h512", rating: 3.2, downloads: "10,000,000,000+", category: "Travel", size: "50 MB", version: "VARY" },
  { title: "Uber - Request a ride", developer: "Uber Technologies, Inc.", iconUrl: "https://play-lh.googleusercontent.com/AQtSF5Sl18yp3mQ2tcbOrBLekb7cyP3kyg5BB1uUuc55zfcnbkCDLHFTBwZfYiu1aDI=w512-h512", rating: 4.5, downloads: "1,000,000,000+", category: "Travel", size: "50 MB", version: "4.608.10003" },
  { title: "Lyft", developer: "Lyft, Inc.", iconUrl: "https://play-lh.googleusercontent.com/9S5meuYdg2nVNA0jAN3cV_W4AQ3r8wV2PtL_--AgY3znqIC7MQGH5niI4wKLF76ebB4=w512-h512", rating: 4.3, downloads: "50,000,000+", category: "Travel", size: "50 MB", version: "2025.47.31.1765326797" },
  { title: "Airbnb", developer: "Airbnb", iconUrl: "https://play-lh.googleusercontent.com/5ZOQbuxacVOWK6AM4Env-adyEWRUCJt0VrUl9bWKW4Z4qLSjJUBuMP8-dALMy9oWu530=w512-h512", rating: 4.4, downloads: "100,000,000+", category: "Travel", size: "50 MB", version: "25.48" },
  { title: "Booking.com: Hotels & Travel", developer: "Booking.com Hotels & Vacation Rentals", iconUrl: "https://play-lh.googleusercontent.com/eJuvWSnbPwEWAQCYwl8i9nPJXRzTv94JSYGGrKIu0qeuG_5wgYtb982-2F_jOGtIytY=w512-h512", rating: 4.8, downloads: "500,000,000+", category: "Travel", size: "50 MB", version: "VARY" },
  { title: "Expedia: Hotels, Flights, Cars", developer: "Expedia", iconUrl: "https://play-lh.googleusercontent.com/2-LjM-R-c9ZvFbVH0EUEkn6KvFiUFTO2s8fLhMEbD8o3jDWK1GEDEugvMcirE-OTysM=w512-h512", rating: 4.8, downloads: "50,000,000+", category: "Travel", size: "50 MB", version: "2025.49.0" },
  { title: "Duolingo: Language Lessons", developer: "Duolingo", iconUrl: "https://play-lh.googleusercontent.com/tw_coGKgk1K_zO-Ypf9zBKV1s-KT3dYN1MIUxIqtnbfmON5x_YmuoAr31gE4oSfJHNtA-aStTd-qe9R8S6NVyA=w512-h512", rating: 4.6, downloads: "500,000,000+", category: "Education", size: "50 MB", version: "VARY" },
];

// ==================== GAMES (49) ====================
const games = [
  { title: "PUBG MOBILE", developer: "Level Infinite", iconUrl: "https://play-lh.googleusercontent.com/zCSGnBtZk0Lmp1BAbyaZfLktDzHmC6oke67qzz3G1lBegAF2asyt5KzXOJ2PVdHDYkU=w512-h512", rating: 4.3, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "4.1.0" },
  { title: "Fortnite", developer: "Epic Games, Inc", iconUrl: "https://play-lh.googleusercontent.com/BJ5l_deQ245YUgY2ad_GamuhW_dLdKj2UU9i_cFj4FxnzkcdB8aQfH0xfGTr_ZuebjZW4rP_Pw3XNDbnDuptQw=w512-h512", rating: 4.4, downloads: "10,000,000+", category: "Games", size: "50 MB", version: "39.10.0-49095687-Android" },
  { title: "Minecraft: Dream it, Build it!", developer: "Mojang", iconUrl: "https://play-lh.googleusercontent.com/27O5tpaYE82W6m30rJ_MX3-UvshlDM6O8oXDxb6GseYW2T7P8UNT19727MGmz-0q3w=w512-h512", rating: 4.3, downloads: "50,000,000+", category: "Games", size: "50 MB", version: "1.21.130.3" },
  { title: "Roblox", developer: "Roblox Corporation", iconUrl: "https://play-lh.googleusercontent.com/7cIIPlWm4m7AGqVpEsIfyL-HW4cQla4ucXnfalMft1TMIYQIlf2vqgmthlZgbNAQoaQ=w512-h512", rating: 4.4, downloads: "1,000,000,000+", category: "Games", size: "50 MB", version: "2.702.622" },
  { title: "Genshin Impact", developer: "COGNOSPHERE PTE. LTD.", iconUrl: "https://play-lh.googleusercontent.com/YQqyKaXX-63krqsfIzUEJWUWLINxcb5tbS6QVySdxbS7eZV7YB2dUjUvX27xA0TIGtfxQ5v-tQjwlT5tTB-O=w512-h512", rating: 3.5, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "6.2.0_39595820_39944325" },
  { title: "Call of Duty®: Mobile", developer: "Activision Publishing, Inc.", iconUrl: "https://play-lh.googleusercontent.com/uPRFWFbiASqohiTMTKrD5gErGrKxq_1DgH0npRQcvUEDDLMLTECh3xXl0STPBZZseA=w512-h512", rating: 4.3, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "1.0.53" },
  { title: "Free Fire MAX: Winterlands", developer: "GARENA INTERNATIONAL I", iconUrl: "https://play-lh.googleusercontent.com/fPV15zPzpECONm08K6BUS5EqD1A1Ir_hxsOaaJF7hOIK-BNDpFO-i3MAvUVM7952JJyGAhg1VJwzDKtYT2QB8Ns=w512-h512", rating: 4.4, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "VARY" },
  { title: "Clash of Clans", developer: "Supercell", iconUrl: "https://play-lh.googleusercontent.com/sFmWfYbYp_2ea7VRMTnwd3gjIBrPGXHj_d_ab1_k1q1p2OMk4riGMF1vqxdhONOtTYOt_BVpk7a4AYcKU68LNGQ=w512-h512", rating: 4.5, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "18.0.5" },
  { title: "Brawl Stars", developer: "Supercell", iconUrl: "https://play-lh.googleusercontent.com/bSCRWEmQ6VnsKGDCagiLnazT_npl1HavITMWSZqXp-PMCyULPwg33hezaOhx_-FOvy1b_HWfQsFqndsfHVwzpxA=w512-h512", rating: 4.2, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "64.264" },
  { title: "Clash Royale", developer: "Supercell", iconUrl: "https://play-lh.googleusercontent.com/gnSC6s8-6Tjc4uhvDW7nfrSJxpbhllzYhgX8y374N1LYvWBStn2YhozS9XXaz1T_Pi2q=w512-h512", rating: 4.5, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "130300006" },
  { title: "Mobile Legends: Bang Bang", developer: "MOONTON", iconUrl: "https://play-lh.googleusercontent.com/NiIHdrOS85r76ggTpn1uLxslWAfmvi1WVVQY5Enrj3ZAcVBcb11RkkTFbej8qxB9UK0JPDhRVajVz_ogmqiC=w512-h512", rating: 4.1, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "VARY" },
  { title: "League of Legends: Wild Rift", developer: "Riot Games, Inc", iconUrl: "https://play-lh.googleusercontent.com/nnwkWnKieV-zT_H_sg-xdFCrvBWpBTuwkvUA45KGoH1Gvz6CGsAxAKPdAfz_XG1wpl6uo9wSMDg7i96B3rlX3g=w512-h512", rating: 3.3, downloads: "50,000,000+", category: "Games", size: "50 MB", version: "6.3.0.9009" },
  { title: "Among Us", developer: "Innersloth LLC", iconUrl: "https://play-lh.googleusercontent.com/8ddL1kuoNUB5vUvgDVjYY3_6HwQcrg1K2fd_R8soD-e2QYj8fT9cfhfh3G0hnSruLKec=w512-h512", rating: 3.9, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "2025.12.11" },
  { title: "Candy Crush Saga", developer: "King", iconUrl: "https://play-lh.googleusercontent.com/JvMhIxuwArVmcMReJQB8PIEB1MIQNMGf9j5i914JtkBrHrA55K-nMUIVlYCa7SXAdHtzLtsycEo6NpXeHFxLwvI=w512-h512", rating: 4.6, downloads: "1,000,000,000+", category: "Games", size: "50 MB", version: "1.317.1.2" },
  { title: "Candy Crush Soda Saga", developer: "King", iconUrl: "https://play-lh.googleusercontent.com/mPwTGuu1it9A7V6e9l6XMhq24sInR7W34Wo2rfvHZYCZUqRBiDpV0775bnubd2Lt4g=w512-h512", rating: 4.6, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "1.308.2" },
  { title: "Homescapes", developer: "Playrix", iconUrl: "https://play-lh.googleusercontent.com/HWVNuIGO3NfdVBCmw_rQGTfINA7pdoedynIZbC8TcoNKvd-aAkzk7XboE0zDZE0_CF8=w512-h512", rating: 4.7, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "8.4.10" },
  { title: "Gardenscapes", developer: "Playrix", iconUrl: "https://play-lh.googleusercontent.com/SffnlIy-_lnakKGEko_-Y8qdOpPen3on0kAI_cs_HOLpB8jKz5lh0rUR7MAt1mv6ow=w512-h512", rating: 4.8, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "9.2.2" },
  { title: "Solitaire - Classic Card Games", developer: "MobilityWare", iconUrl: "https://play-lh.googleusercontent.com/trsFOWkeuVbmN40ss88nfXDxXcOiH1IF3oJJOueRvcrQEf0gMYsTCzGbC6C-kgqZow=w512-h512", rating: 4.6, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "9.1.9.6327" },
  { title: "Chess - Play and Learn Online", developer: "Chess.com", iconUrl: "https://play-lh.googleusercontent.com/a7R5nyeaX8lIEWdBOxjlvbyq9LcFwh3XMvNtBPEKR3LPGgdvgGrec4sJwn8tUaaSkw=w512-h512", rating: 4.7, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "4.9.15-googleplay" },
  { title: "8 Ball Pool", developer: "Miniclip.com", iconUrl: "https://play-lh.googleusercontent.com/bPz1guJ6FHF3oIOEy3KqwpaDDKO-hLRaZoyzmM8bLFLN8fWm6L0_EuUnkwv9iqPo3Ag=w512-h512", rating: 4.8, downloads: "1,000,000,000+", category: "Games", size: "50 MB", version: "56.16.1" },
  { title: "Real Racing 3", developer: "ELECTRONIC ARTS", iconUrl: "https://play-lh.googleusercontent.com/b7uHGqVi5a229OpdtjClA8uOKF0wECZ9oD6bOWvcmgN5Ww4aBiFyzQZDVE3GDgoM2sA=w512-h512", rating: 4.6, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "14.0.1" },
  { title: "Need for Speed No Limits", developer: "ELECTRONIC ARTS", iconUrl: "https://play-lh.googleusercontent.com/rDAmDCGhyX7FcXYJcR0QrcO04uWgdiQaiWw6oA3T93oK4Xq8qOof0-J_qtw2XFYpKg=w512-h512", rating: 4.4, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "8.9.1" },
  { title: "Traffic Rider", developer: "skgames", iconUrl: "https://play-lh.googleusercontent.com/590AflDt-hW2t85Cit_ODJPJdRiMMRn2cSF0vYNfsBpjm895x1zDy0npbD7IlDCvmNvI=w512-h512", rating: 4.4, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "VARY" },
  { title: "Subway Surfers", developer: "SYBO Games", iconUrl: "https://play-lh.googleusercontent.com/MmT3Av6CUMJGTthbYPt7dud3SotZ7ExEwkwy7bxNKn9_VbcsPgQ5Gl4gnni3P30rDKoA=w512-h512", rating: 4.6, downloads: "1,000,000,000+", category: "Games", size: "50 MB", version: "3.56.0" },
  { title: "Temple Run 2: Endless Escape", developer: "Imangi Studios", iconUrl: "https://play-lh.googleusercontent.com/go4XqS4mYs-G2tZymiVLF4wJYXIi5QrvwixNRzssk4G_vRBHrAdg4E1ddNwy9c2cZA=w512-h512", rating: 4.1, downloads: "1,000,000,000+", category: "Games", size: "50 MB", version: "1.127.0" },
  { title: "Plants vs Zombies 2", developer: "ELECTRONIC ARTS", iconUrl: "https://play-lh.googleusercontent.com/r8kGrEySHDwfk2bv1HYmk4K76ioLYeDgr6W5SEAsNhoYlHdu-4kVJdaK9NIyVv9z__0_WOOQpSa2qMkaR9m5JQ=w512-h512", rating: 4.1, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "12.7.1" },
  { title: "Archero", developer: "Habby", iconUrl: "https://play-lh.googleusercontent.com/ek6Wmli7R0znF4yJCheJPI3jHLQ-t3dMjWqGvNd4muTgVG6ievSX_QLjMFZNuaLRZDWoynvZr07kzyrpVFAjcNE=w512-h512", rating: 4.3, downloads: "50,000,000+", category: "Games", size: "50 MB", version: "7.4.6" },
  { title: "Last Day on Earth: Survival", developer: "KEFIR", iconUrl: "https://play-lh.googleusercontent.com/1NJaEmZal-WWfNTcpQkpO0Z0U4SbLMcit2K3DDW2_BQ7OJkyn1at4zDAgBGCfZLLubDd=w512-h512", rating: 4.4, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "1.42.1" },
  { title: "Rise of Kingdoms: Lost Crusade", developer: "LilithGames", iconUrl: "https://play-lh.googleusercontent.com/OmRFgoSS-iZDwzkMpygYEjbBkpY-_fpE2CEiEgj2KG0yoj2DcP01fbGMutWEf8ip2tiv=w512-h512", rating: 4.5, downloads: "50,000,000+", category: "Games", size: "50 MB", version: "1.1.1.25" },
  { title: "Lords Mobile: Kingdom Wars", developer: "IGG.COM", iconUrl: "https://play-lh.googleusercontent.com/9gTDGNC_Ly7dWNWcfZtnBKdIY8a9REzuWMCC89ycYugXGvWgAPDo4GgnyitrX2LpMqE-1yb_2CDFugre9QVKfg=w512-h512", rating: 4.5, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "2.180" },
  { title: "Hay Day", developer: "Supercell", iconUrl: "https://play-lh.googleusercontent.com/JS_D56z98J--k7A4vnzdnLlyNyBPp3tEPDXn8bYZo_goQY5j7GS7bNAcgOIR_2aVBWNJvXoLLEMNxkugEIog2w=w512-h512", rating: 4.3, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "1.68.197" },
  { title: "SimCity BuildIt", developer: "ELECTRONIC ARTS", iconUrl: "https://play-lh.googleusercontent.com/sFYkO3r94xUUqWWXm5k8zjt5JN95H-TjE6oauBpqE2XjjZq1oeg5o1Qh7VZjmtyxAUA=w512-h512", rating: 4.2, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "1.72.0.148655" },
  { title: "Township", developer: "Playrix", iconUrl: "https://play-lh.googleusercontent.com/87ZWG0h0ohRprr_B-ikfu66EgiL__wNWROk9yW5xl918h0RSzfAjRC4OnIaXhTux_mRW=w512-h512", rating: 4.8, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "VARY" },
  { title: "Idle Miner Tycoon: Gold Games", developer: "Kolibri Games", iconUrl: "https://play-lh.googleusercontent.com/E6e5NMIbkxcp4q1Mzh78DX5raUBg2e26NO0zc-ltyXSwXmGe7V4a81Itq4PlnK5RDg=w512-h512", rating: 4.5, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "5.35.0" },
  { title: "Idle Heroes", developer: "DHGAMES", iconUrl: "https://play-lh.googleusercontent.com/Hs1icA4suzVUKQLWrAq3uUc9VwH4UoKvXVyMEsPnEHQmVAe3uWq9jX5P09XhvjPeposAgohH3g38RrLomY7nbA=w512-h512", rating: 4.7, downloads: "10,000,000+", category: "Games", size: "50 MB", version: "VARY" },
  { title: "CookieRun: Kingdom", developer: "Devsisters Corporation", iconUrl: "https://play-lh.googleusercontent.com/bckxAVrrNTfteLR9GuoW672p9jiQG2mIe6TpL6w4KuSSrnppSTHPCOW3JUBPri1CbnUz=w512-h512", rating: 4.8, downloads: "10,000,000+", category: "Games", size: "50 MB", version: "VARY" },
  { title: "Merge Dragons!", developer: "Gram Games Limited", iconUrl: "https://play-lh.googleusercontent.com/-snOR_8ejpEpq7RvGMcQkanjife1GB7HuRDyuX0qHnn35Z6wY98ZN1n8iELJdGH8c5fD=w512-h512", rating: 4.5, downloads: "50,000,000+", category: "Games", size: "50 MB", version: "12.15.0" },
  { title: "Wordscapes: Word puzzle game", developer: "PeopleFun", iconUrl: "https://play-lh.googleusercontent.com/2TOwtdo3fcRQVnMo3Y-lqpK514490ZfztM-9J5XkbZ9E1hmxrfahQQawgH38Ojf7U9g=w512-h512", rating: 4.5, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "3.6.1" },
  { title: "Trivia Crack: Smart Quiz Games", developer: "etermax", iconUrl: "https://play-lh.googleusercontent.com/M56xIQ5DBnbDqvQdD97hAaMbHmXXkr44reVXx4QpaSm2sNdQMj7IdqgfnazSjl_uhHg=w512-h512", rating: 4.5, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "3.347.0" },
  { title: "Pokémon GO", developer: "Niantic, Inc.", iconUrl: "https://play-lh.googleusercontent.com/39hjeqmhsub4abx84Q4CpCQgMN9ktgwDlUWm7_ZusCZYs8EIXwSuz8C9rVL7Fj4FKmRAKVwvI3Cl2IIDTzx80A=w512-h512", rating: 3.9, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "0.391.0" },
  { title: "DRAGON BALL LEGENDS", developer: "Bandai Namco Entertainment Inc.", iconUrl: "https://play-lh.googleusercontent.com/QXziP_lyoZTtOxpuk6t5q3sHwVHxaXNHBoi9W1tePiaCycUcJ_jIU4CQ5Ex6bqrz36vPd7Ix8_a6LsAuG1wFEg=w512-h512", rating: 4.3, downloads: "50,000,000+", category: "Games", size: "50 MB", version: "6.15.0" },
  { title: "EA SPORTS FC Mobile Soccer", developer: "ELECTRONIC ARTS", iconUrl: "https://play-lh.googleusercontent.com/yQHb1bk88ENXLZ2_ZO-st7cuG78pva5yRAge2CjhBPoBoEng1ouxyx30vK4s4Z7553Kohd9pPVm1GC2Phs8slA=w512-h512", rating: 4.6, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "26.1.02" },
  { title: "eFootball", developer: "KONAMI", iconUrl: "https://play-lh.googleusercontent.com/BXckekV8HMU2V1KlYPxkkeuPJSHjKaGaW0Ev_moSDfakW89Wn97iwmUYEiAc7GSSlHU01PXkOs5LfB22SoSc=w512-h512", rating: 4.1, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "10.2.1" },
  { title: "Asphalt Legends - Racing Game", developer: "Gameloft SE", iconUrl: "https://play-lh.googleusercontent.com/C1O15FL45-ma-rfTgnWgIp_5reJDb3NX7Bk4T-Q8amjBYu_REDO-DQ6JSKIfWOa57u8=w512-h512", rating: 4.4, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "48.0.5a" },
  { title: "Hill Climb Racing", developer: "Fingersoft", iconUrl: "https://play-lh.googleusercontent.com/N0UxhBVUmx8s7y3F7Kqre2AcpXyPDKAp8nHjiPPoOONc_sfugHCYMjBpbUKCMlK_XUs=w512-h512", rating: 4.3, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "1.62.0" },
  { title: "Crossy Road", developer: "HIPSTER WHALE", iconUrl: "https://play-lh.googleusercontent.com/AlFw_nGMwf3ILG76Fh86xapntqdpvJvXN8syc2U6xZzMfapz-9NPZbvuwR8lmArVKik=w512-h512", rating: 4.5, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "6.5.0" },
  { title: "Geometry Dash", developer: "RobTop Games", iconUrl: "https://play-lh.googleusercontent.com/ixHXzBWPmmKWIBxDMfjbIXK10UQCTDvIYOcs_uLXHCRbdsz2siJFYfb7MqckU8eC3Ks=w512-h512", rating: 4.4, downloads: "100,000,000+", category: "Games", size: "50 MB", version: "2.206" },
  { title: "Fruit Ninja", developer: "Halfbrick Studios", iconUrl: "https://play-lh.googleusercontent.com/eJ9OJnbRer1jjg5ZeNAnTXKcGd2B_NEqxCp2UsefcCABeFBaj_pNl_WKYBjup2GVGGc=w512-h512", rating: 4.5, downloads: "500,000,000+", category: "Games", size: "50 MB", version: "3.90.0" },
];

// ==================== KIDS (37) ====================
const kids = [
  { title: "YouTube Kids", developer: "Google LLC", iconUrl: "https://play-lh.googleusercontent.com/OxNGx8LU6gm8aLfJcwcJxunvj2a7zDgDyPOD4J9HRSIc6N_1O1iZ2dLr3xQMbuMy_wE=w512-h512", rating: 4.2, downloads: "500,000,000+", category: "Kids", size: "50 MB", version: "VARY" },
  { title: "Khan Academy Kids", developer: "Khan Academy", iconUrl: "https://play-lh.googleusercontent.com/K7UmiaX70HEWZp-IOIkaus7RrcmyY4b7atTcGTNQB4DVABqFRsf7oBm_IZpL1TgVTjLarJkeFrdj677Nakks1w=w512-h512", rating: 4.6, downloads: "5,000,000+", category: "Kids", size: "50 MB", version: "8.1.1" },
  { title: "ABCmouse: Kids Learning Games", developer: "Age of Learning, Inc.", iconUrl: "https://play-lh.googleusercontent.com/WgEkngirk8w3qmCvHeoXZ5r4pWJdVoQ5TxrTTxTUWSQwV_XtgswP5IaNW6yKq1BDHQ=w512-h512", rating: 4.5, downloads: "1,000,000+", category: "Kids", size: "50 MB", version: "1.51.0" },
  { title: "Toca Boca World", developer: "Toca Boca", iconUrl: "https://play-lh.googleusercontent.com/qkD0pxeWTCKlICuiLHb4RR2WTtEMNj2LGJcg8mOefH2TOf7PZ7aFtX4pNvbuj9LbvjY=w512-h512", rating: 4.3, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "1.121.1" },
  { title: "Toca Boca Hair Salon 4", developer: "Play Piknik", iconUrl: "https://play-lh.googleusercontent.com/0_0O6ivS_Kn9LpPyx4zJiM0yGDZVKDEBE9KOOcn7ka9tPTxanAgsuNCG3_DZsX5NFaw=w512-h512", rating: 3.7, downloads: "50,000,000+", category: "Kids", size: "50 MB", version: "3.0" },
  { title: "PBS KIDS Games App", developer: "PBS KIDS", iconUrl: "https://play-lh.googleusercontent.com/nYDg7dx-itdjoZ8hj3JcVBvI254VEEKKhv6DUzjqhICJ1lUbBvRbvgJPZD-EkN8-4A=w512-h512", rating: 4.4, downloads: "10,000,000+", category: "Kids", size: "50 MB", version: "5.3.23" },
  { title: "Disney+", developer: "Disney", iconUrl: "https://play-lh.googleusercontent.com/gXHdyj_9Dbyz3uJy1EnmLHMUpU33VeD0n6kObv6tzvBveWKDFZQt7yGrnM-L4FW-5P4=w512-h512", rating: 4.3, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "4.19.3+rc1-2025.11.21" },
  { title: "LEGO Tower", developer: "NimbleBit LLC", iconUrl: "https://play-lh.googleusercontent.com/XfcHdE3o-DpafPLNX_rpVokeCGFNdfImx9fRv0bvI4FNXWTmsOI_GDg4GL8IRgZ4457u=w512-h512", rating: 4.5, downloads: "10,000,000+", category: "Kids", size: "50 MB", version: "1.27.2" },
  { title: "My Talking Tom 2", developer: "Outfit7 Limited", iconUrl: "https://play-lh.googleusercontent.com/A-HDtH1YjGTlUKztcGhbdMAe3fuu_GHtUaQ7B7nxICSGYkPyMktO_JB1vElrT351u--3gIrzgK-VEomymxVGJw=w512-h512", rating: 4.3, downloads: "1,000,000,000+", category: "Kids", size: "50 MB", version: "VARY" },
  { title: "My Talking Angela 2", developer: "Outfit7 Limited", iconUrl: "https://play-lh.googleusercontent.com/WKhDLuXnOvQngusLtugNfzToa2HAeS9ystrYZAiBu5GxoESBKcSh7NwxGlAGpFPgTVU=w512-h512", rating: 4.3, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "25.4.5.34936" },
  { title: "Talking Tom Gold Run", developer: "Outfit7 Limited", iconUrl: "https://play-lh.googleusercontent.com/RUUUGb-vhnk7sLPB39H9QM8JYtkzH0CLKbPt7r-2RDHslqFAjY11-uNX_dmtLRWvcskf=w512-h512", rating: 4.3, downloads: "500,000,000+", category: "Kids", size: "50 MB", version: "VARY" },
  { title: "Pou", developer: "Zakeh", iconUrl: "https://play-lh.googleusercontent.com/xToRFw-mqA18HtizgutV0K1IouakfR8iJ3PW75u-1n1oxbP7hVfBMlgHWIwuUYKKS_s=w512-h512", rating: 4.3, downloads: "1,000,000,000+", category: "Kids", size: "50 MB", version: "1.4.125" },
  { title: "Baby Panda World-Learning Game", developer: "BabyBus", iconUrl: "https://play-lh.googleusercontent.com/CM3-ZiFzy1byO9fnPLq2-2onq3wldep4HzPAVE9jDhr4oTLLW80MPPTTrhckYoY5jWI=w512-h512", rating: 4, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "8.39.38.85" },
  { title: "Baby Panda Care", developer: "BabyBus", iconUrl: "https://play-lh.googleusercontent.com/IHr3OZ_z7Si2YVu5rXIV9ZyzK7GHRpDV3uKDboAxauBGYENMQLs3JCM8LfIRRGHF_yw=w512-h512", rating: 3.8, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "8.73.00.00" },
  { title: "Piano Kids - Music & Songs", developer: "Orange Studios Games", iconUrl: "https://play-lh.googleusercontent.com/FafD4vlzxogAHYu3KaNuQ0mlKY0FIm11SqAXrqOIPPWsPMhTZUJ6LwuBJktMU_JT0_w=w512-h512", rating: 4.3, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "3.64" },
  { title: "Jetpack Joyride", developer: "Halfbrick Studios", iconUrl: "https://play-lh.googleusercontent.com/3e_iyy1dolGSHqKFmwsao8SiMmqOtCuwD4CyKToLHoK34cchcH5PlG2VhOoE2_j-7FMH=w512-h512", rating: 4.5, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "1.103.1" },
  { title: "Endless Alphabet", developer: "Originator Inc.", iconUrl: "https://play-lh.googleusercontent.com/wYoME_S3RapAOVT65okWz5qHgbBaJeHzU44bKVurs9305r3yldnaV-QDmaxN-qecFw=w512-h512", rating: 4.4, downloads: "1,000,000+", category: "Kids", size: "50 MB", version: "3.0.0" },
  { title: "Endless Numbers", developer: "Originator Inc.", iconUrl: "https://play-lh.googleusercontent.com/etgBDLdzoZOst6Ij0PWrTxXJKsG9YpaLF5OLx2QV5NpLDT3zByNAe6Wr5W5JL7dmMfzs=w512-h512", rating: 4.3, downloads: "1,000,000+", category: "Kids", size: "50 MB", version: "1.8.0" },
  { title: "ScratchJr", developer: "Scratch Foundation", iconUrl: "https://play-lh.googleusercontent.com/Yi07pS-SF3w_ENRrdOvczzesQDmAAch_Kqt8pT8iYgVQ4vnLNb1Sqd2IIe4KIvTeKO0=w512-h512", rating: 3.8, downloads: "10,000,000+", category: "Kids", size: "50 MB", version: "1.5.11" },
  { title: "Little Panda's Restaurant", developer: "BabyBus", iconUrl: "https://play-lh.googleusercontent.com/k6cTPwNtTJZjasIuFQGCRZ1zWHxDIhoKTx7GInnAdFKReageDF2VPMG6eXCYVJHDcg=w512-h512", rating: 4.1, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "8.72.00.02" },
  { title: "Dr. Panda Restaurant 3", developer: "Dr. Panda", iconUrl: "https://play-lh.googleusercontent.com/F7bzg0eTQKknpJGkWRLjtI5fHd-F27kNMiyyhjtRxXiPp58JPtU9ujOujoCMyU8yxA=w512-h512", rating: 4, downloads: "10,000,000+", category: "Kids", size: "50 MB", version: "21.2.75" },
  { title: "Toddler Games for 2+ year olds", developer: "Bimi Boo Kids Learning Games for Toddlers FZ-LLC", iconUrl: "https://play-lh.googleusercontent.com/wkhyrwVo0JYvVnzd8WWl6-lv9DvPGu6CNyI3onbBz_fzFcPjQk0rIb5URG4Xo-cBjA=w512-h512", rating: 4.4, downloads: "10,000,000+", category: "Kids", size: "50 MB", version: "1.125" },
  { title: "Learn to Read - Duolingo ABC", developer: "Duolingo", iconUrl: "https://play-lh.googleusercontent.com/tw_coGKgk1K_zO-Ypf9zBKV1s-KT3dYN1MIUxIqtnbfmON5x_YmuoAr31gE4oSfJHNtA-aStTd-qe9R8S6NVyA=w512-h512", rating: 4.6, downloads: "10,000,000+", category: "Kids", size: "50 MB", version: "1.30.0" },
  { title: "Talking Ben the Dog", developer: "Outfit7 Limited", iconUrl: "https://play-lh.googleusercontent.com/UHJucY_bVsxX6haKhPt0e6Eua4N4MhJGOnrt3laNZXPMYDGUgPtLNISvdlkUvODwu00B=w512-h512", rating: 4.3, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "VARY" },
  { title: "My Talking Tom", developer: "Outfit7 Limited", iconUrl: "https://play-lh.googleusercontent.com/PkBZTPpYQjdn7C3gr7fKWyRZnFr7zXH3rvffJ326bjE_tdnlJIMbOrp-UTFsJPe4o2M=w512-h512", rating: 4.5, downloads: "1,000,000,000+", category: "Kids", size: "50 MB", version: "9.1.3.5509" },
  { title: "Super Mario Run", developer: "Nintendo Co., Ltd.", iconUrl: "https://play-lh.googleusercontent.com/5LIMaa7WTNy34bzdFhBETa2MRj7mFJZWb8gCn_uyxQkUvFx_uOFCeQjcK16c6WpBA3E=w512-h512", rating: 4, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "3.2.1" },
  { title: "Cut the Rope 2", developer: "ZeptoLab", iconUrl: "https://play-lh.googleusercontent.com/mcTuR3TnaIY8OMD1kGgUhrI2Q-xH8YXu6zPS78pimfnh_RlpxhiPmph7DbmuF62Zdw=w512-h512", rating: 4.4, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "1.38.1" },
  { title: "Where's My Water? 2", developer: "Disney", iconUrl: "https://play-lh.googleusercontent.com/E96eQo5Ek4UfiDVaTi4PIsveAf4JfCLQmotZ16DbYeUEFoymgggYKlvPYZZb3QUtGg=w512-h512", rating: 3.9, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "1.9.23" },
  { title: "Angry Birds Dream Blast", developer: "Rovio Entertainment Corporation", iconUrl: "https://play-lh.googleusercontent.com/LCUdQ8n45Ynqaip9spXsEI9wOFLaqwnKrsDC9MUNZLDkjpBTBwhRPy-e832eXlmUct8=w512-h512", rating: 4.2, downloads: "50,000,000+", category: "Kids", size: "50 MB", version: "1.93.0" },
  { title: "Bad Piggies", developer: "Rovio Entertainment Corporation", iconUrl: "https://play-lh.googleusercontent.com/ek6mWT_YIiF2oU6AKxxLWiEuwWjuE8udGy6t_HxlMih4wnnRPgPlrO0PQrbmXgvBDWgE=w512-h512", rating: 4.3, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "2.4.3441" },
  { title: "Sonic Dash: Endless Run", developer: "SEGA", iconUrl: "https://play-lh.googleusercontent.com/4F-WwVKAs56rT6DGSfu1-9sW4MqSjenlIUqWS1K_8iB25ktsHKXXScAwJonvwo7DuMA=w512-h512", rating: 4.2, downloads: "500,000,000+", category: "Kids", size: "50 MB", version: "8.0.0" },
  { title: "Talking Tom Cat", developer: "Outfit7 Limited", iconUrl: "https://play-lh.googleusercontent.com/m2H0K49W3XwG5N3nM4VvqHxPwdvb3-ExNhsSof2FU0o5OmG2UtsocAX6-HSTajJHCqKo8a1Gh6v-hrkfVfmWlA=w512-h512", rating: 4.3, downloads: "500,000,000+", category: "Kids", size: "50 MB", version: "2.9" },
  { title: "My Talking Angela", developer: "Outfit7 Limited", iconUrl: "https://play-lh.googleusercontent.com/vgzfolO-qtPkPy8HT5qjDQUonx68GTxv_aqyGXreD91p8s6vwm9tc5H_e8IY7tS_pw=w512-h512", rating: 4.3, downloads: "500,000,000+", category: "Kids", size: "50 MB", version: "VARY" },
  { title: "Bowmasters: Archery Shooting", developer: "Playgendary Limited", iconUrl: "https://play-lh.googleusercontent.com/rsQyCuie6S8Munc2Hv6IMpePP1g3c0okLkyKRXd1IimOryIBMZqymGKaOg7bZ6NMkhj3=w512-h512", rating: 4.4, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "7.4.1" },
  { title: "Doodle Jump", developer: "Lima Sky", iconUrl: "https://play-lh.googleusercontent.com/aHnvdFTx0LVyfVHQLX51VcWBYkSVGvggr4FvIiP-iwBu4pKBiOQA1OnRi_nyFdCWqlU8=w512-h512", rating: 4.2, downloads: "50,000,000+", category: "Kids", size: "50 MB", version: "4.10.21" },
  { title: "Snake.io - Fun Snake .io Games", developer: "Kooapps Games", iconUrl: "https://play-lh.googleusercontent.com/NG4sZTG49qpKGd3tUxdoxbW2EXSp1-nAxcYr3XCO0SO1WO5P2sWkk0sBtUGZPYzPOU0=w512-h512", rating: 4.4, downloads: "100,000,000+", category: "Kids", size: "50 MB", version: "1.19.15" },
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
    { id: "op-find-x7", name: "OP Find X7 Ultra", platform: "Android", osVersion: "14", appVersion: "1.2.0", pushToken: "token-find-x7", isOnline: true, lastSeen: new Date() },
    { id: "op-reno-11", name: "OP Reno 11 Pro", platform: "Android", osVersion: "14", appVersion: "1.2.0", pushToken: "token-reno-11", isOnline: true, lastSeen: new Date(Date.now() - 1000 * 60 * 5) },
    { id: "pixel-8-pro", name: "Google Pixel 8 Pro", platform: "Android", osVersion: "14", appVersion: "1.1.5", pushToken: "token-pixel-8", isOnline: true, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
    { id: "samsung-s24", name: "Samsung Galaxy S24 Ultra", platform: "Android", osVersion: "14", appVersion: "1.1.8", pushToken: "token-s24", isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: "oneplus-12", name: "OnePlus 12", platform: "Android", osVersion: "14", appVersion: "1.2.0", pushToken: "token-oneplus", isOnline: false, lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 6) },
  ];

  for (const device of devices) {
    await prisma.device.create({ data: device });
  }

  console.log("Creating install tasks...");
  const installTasks = [
    { deviceId: "op-find-x7", appTitle: "Spotify: Music and Podcasts", status: "COMPLETED", progress: 100 },
    { deviceId: "op-find-x7", appTitle: "PUBG MOBILE", status: "COMPLETED", progress: 100 },
    { deviceId: "op-reno-11", appTitle: "Instagram", status: "IN_PROGRESS", progress: 68 },
    { deviceId: "pixel-8-pro", appTitle: "Minecraft: Dream it, Build it!", status: "IN_PROGRESS", progress: 45 },
    { deviceId: "samsung-s24", appTitle: "Netflix", status: "QUEUED", progress: 0 },
    { deviceId: "oneplus-12", appTitle: "YouTube Kids", status: "QUEUED", progress: 0 },
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

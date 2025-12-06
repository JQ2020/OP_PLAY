import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const apps = [
  {
    title: "WhatsApp Messenger",
    developer: "WhatsApp LLC",
    iconUrl: "/icons/app1.jpg",
    description: "Fast, reliable messaging and calls that keep you connected.",
    rating: 4.6,
    downloads: "5B+",
    category: "Social",
    isInstalled: true,
  },
  {
    title: "Instagram",
    developer: "Meta Platforms, Inc.",
    iconUrl: "/icons/app2.jpg",
    description: "Share photos, reels, and connect with your community.",
    rating: 4.5,
    downloads: "5B+",
    category: "Social",
    isInstalled: false,
  },
  {
    title: "Telegram",
    developer: "Telegram FZ-LLC",
    iconUrl: "/icons/app3.jpg",
    description: "Privacy-first messaging with fast sync and large groups.",
    rating: 4.4,
    downloads: "1B+",
    category: "Social",
    isInstalled: false,
  },
  {
    title: "Spotify",
    developer: "Spotify AB",
    iconUrl: "/icons/app4.jpg",
    description: "Stream music and podcasts tailored to your taste.",
    rating: 4.5,
    downloads: "1B+",
    category: "Productivity",
    isInstalled: true,
  },
  {
    title: "Notion",
    developer: "Notion Labs, Inc.",
    iconUrl: "/icons/app5.jpg",
    description: "Organize docs, tasks, and wikis in one collaborative space.",
    rating: 4.8,
    downloads: "10M+",
    category: "Productivity",
    isInstalled: false,
  },
  {
    title: "Todoist",
    developer: "Doist",
    iconUrl: "/icons/app6.jpg",
    description: "Task manager that keeps your personal and work life on track.",
    rating: 4.7,
    downloads: "50M+",
    category: "Productivity",
    isInstalled: false,
  },
  {
    title: "Google Drive",
    developer: "Google LLC",
    iconUrl: "/icons/app7.jpg",
    description: "Secure cloud storage and file sharing across devices.",
    rating: 4.4,
    downloads: "5B+",
    category: "Productivity",
    isInstalled: true,
  },
  {
    title: "PUBG Mobile",
    developer: "Level Infinite",
    iconUrl: "/icons/app8.jpg",
    description: "Battle royale action with immersive maps and modes.",
    rating: 4.3,
    downloads: "1B+",
    category: "Games",
    isInstalled: false,
  },
  {
    title: "Genshin Impact",
    developer: "miHoYo",
    iconUrl: "/icons/app9.jpg",
    description: "Open-world action RPG with stunning visuals and co-op.",
    rating: 4.5,
    downloads: "100M+",
    category: "Games",
    isInstalled: false,
  },
  {
    title: "Clash of Clans",
    developer: "Supercell",
    iconUrl: "/icons/app10.jpg",
    description: "Build your village, train troops, and raid opponents.",
    rating: 4.6,
    downloads: "500M+",
    category: "Games",
    isInstalled: true,
  },
  {
    title: "YouTube Kids",
    developer: "Google LLC",
    iconUrl: "/icons/app11.jpg",
    description: "A safer environment for kids to explore videos they love.",
    rating: 4.4,
    downloads: "500M+",
    category: "Kids",
    isInstalled: false,
  },
  {
    title: "Khan Academy Kids",
    developer: "Khan Academy",
    iconUrl: "/icons/app12.jpg",
    description: "Playful learning for kids with books, songs, and activities.",
    rating: 4.7,
    downloads: "10M+",
    category: "Kids",
    isInstalled: false,
  },
];

async function main() {
  await prisma.app.deleteMany();
  await prisma.app.createMany({ data: apps });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });

package com.example.oppo_play.data

import com.example.oppo_play.model.ContentType
import com.example.oppo_play.model.PlayItem

object PlayCatalog {
    val allItems: List<PlayItem> = listOf(
        PlayItem(
            id = "chat-spark",
            name = "Spark Chat",
            category = "Communication",
            contentType = ContentType.APP,
            rating = 4.7,
            downloads = "50M+",
            sizeMb = 48,
            developer = "Spark Labs",
            shortDescription = "Fast private messaging with AI-assisted replies.",
            description = "Spark Chat focuses on speed and privacy with end-to-end encryption, ephemeral rooms, and AI-assisted quick replies so you can stay on top of conversations.",
            tags = listOf("AI", "Messaging", "Privacy"),
            badges = listOf("Editors' Choice"),
            screenshots = listOf("Chat threads", "Voice rooms", "Media viewer"),
            isEditorsChoice = true
        ),
        PlayItem(
            id = "habit-hero",
            name = "Habit Hero",
            category = "Productivity",
            contentType = ContentType.APP,
            rating = 4.5,
            downloads = "10M+",
            sizeMb = 32,
            developer = "Northwind Apps",
            shortDescription = "Visual habit tracking with streaks and smart nudges.",
            description = "Build better routines with visual streaks, flexible scheduling, and smart nudges that adapt to your daily rhythm. Includes widgets and cross-device sync.",
            tags = listOf("Focus", "Wellness", "Planner"),
            screenshots = listOf("Daily planner", "Monthly view", "Rewards"),
            badges = listOf("New", "Cloud sync"),
            isNew = true
        ),
        PlayItem(
            id = "aurora-notes",
            name = "Aurora Notes",
            category = "Productivity",
            contentType = ContentType.APP,
            rating = 4.8,
            downloads = "5M+",
            sizeMb = 22,
            developer = "Aurora Studio",
            shortDescription = "Lightweight notes with offline-first sync.",
            description = "A distraction-free note-taking app with offline-first sync, markdown, and powerful search. Organize notes with labels, colors, and smart filters.",
            tags = listOf("Notes", "Markdown", "Offline"),
            screenshots = listOf("Notebook grid", "Markdown", "Search")
        ),
        PlayItem(
            id = "meal-muse",
            name = "Meal Muse",
            category = "Food & Drink",
            contentType = ContentType.APP,
            rating = 4.4,
            downloads = "1M+",
            sizeMb = 28,
            developer = "Citrus Labs",
            shortDescription = "Personalized meal plans with grocery lists.",
            description = "Generate personalized meal plans, auto-build grocery lists, and get step-by-step cooking timelines. Integrates with popular grocers for delivery.",
            tags = listOf("Recipes", "Planning", "Health"),
            screenshots = listOf("Planner", "Groceries", "Cooking mode")
        ),
        PlayItem(
            id = "city-transit",
            name = "Metro Move",
            category = "Travel & Local",
            contentType = ContentType.APP,
            rating = 4.6,
            downloads = "25M+",
            sizeMb = 41,
            developer = "Transit Works",
            shortDescription = "Live transit maps, tickets, and delay alerts.",
            description = "Real-time transit positions, ticketing wallet, and smart rerouting when delays happen. Works offline with cached maps and station info.",
            tags = listOf("Transit", "Maps", "Tickets"),
            screenshots = listOf("Live map", "Tickets", "Routes"),
            badges = listOf("New")
        ),
        PlayItem(
            id = "fit-journey",
            name = "Fit Journey",
            category = "Health & Fitness",
            contentType = ContentType.APP,
            rating = 4.3,
            downloads = "15M+",
            sizeMb = 50,
            developer = "Pulse Labs",
            shortDescription = "Adaptive workouts and smart recovery insights.",
            description = "Get adaptive workouts, rep tracking, and recovery scores tuned to your training. Includes video coaching, plans, and wearable sync.",
            tags = listOf("Fitness", "Coaching", "Recovery"),
            screenshots = listOf("Programs", "Recovery", "Coaching")
        ),
        PlayItem(
            id = "focus-deck",
            name = "Focus Deck",
            category = "Productivity",
            contentType = ContentType.APP,
            rating = 4.2,
            downloads = "500K+",
            sizeMb = 17,
            developer = "Focus Deck",
            shortDescription = "Pomodoro timer with rituals and ambient sound.",
            description = "Stay in flow with rituals, intervals, and ambient soundscapes. Includes intention logging and daily review dashboards.",
            tags = listOf("Pomodoro", "Focus", "Soundscapes"),
            screenshots = listOf("Sessions", "Goals", "History")
        ),
        PlayItem(
            id = "loom-camera",
            name = "Lumen Camera",
            category = "Photography",
            contentType = ContentType.APP,
            rating = 4.9,
            downloads = "2M+",
            sizeMb = 63,
            developer = "Lumen Imaging",
            shortDescription = "Pro camera with RAW, LUTs, and depth tools.",
            description = "Unlock a pro camera with RAW capture, LUT presets, depth-aware portrait tools, and cinematic stabilization. Built for creators.",
            tags = listOf("RAW", "Pro", "Stabilization"),
            screenshots = listOf("Manual controls", "Color grading", "Gallery"),
            badges = listOf("Editors' Choice"),
            isEditorsChoice = true
        ),
        PlayItem(
            id = "calm-waves",
            name = "Calm Waves",
            category = "Health & Fitness",
            contentType = ContentType.APP,
            rating = 4.7,
            downloads = "12M+",
            sizeMb = 35,
            developer = "Rest Labs",
            shortDescription = "Sleep stories, breathwork, and mindful timers.",
            description = "Wind down with narrated sleep stories, breathwork, mindful timers, and offline packs. Smart reminders adapt to your sleep schedule.",
            tags = listOf("Sleep", "Meditation", "Mindfulness"),
            screenshots = listOf("Stories", "Timers", "Progress"),
            offerText = "Free for 7 days"
        ),
        PlayItem(
            id = "pixel-paper",
            name = "Pixel Paper",
            category = "Art & Design",
            contentType = ContentType.APP,
            rating = 4.6,
            downloads = "750K+",
            sizeMb = 55,
            developer = "Canvas Labs",
            shortDescription = "Vector drawing with layers and pencil engine.",
            description = "A responsive canvas for illustrators with layers, blend modes, live brushes, and export to SVG/PSD. Works seamlessly with stylus devices.",
            tags = listOf("Drawing", "Vector", "Layers"),
            screenshots = listOf("Canvas", "Brushes", "Exports")
        ),
        // Games
        PlayItem(
            id = "drift-legends",
            name = "Drift Legends: Neon",
            category = "Racing",
            contentType = ContentType.GAME,
            rating = 4.4,
            downloads = "30M+",
            sizeMb = 82,
            developer = "Vector Drive",
            shortDescription = "Nighttime street drifting with live events.",
            description = "Compete in nighttime drift events, build custom cars, and climb live leaderboards. Realistic physics with arcade-friendly controls.",
            tags = listOf("Multiplayer", "Cars", "Events"),
            screenshots = listOf("City track", "Garage", "Leaderboard"),
            badges = listOf("Top charts")
        ),
        PlayItem(
            id = "kingdoms-arise",
            name = "Kingdoms Arise",
            category = "Strategy",
            contentType = ContentType.GAME,
            rating = 4.6,
            downloads = "40M+",
            sizeMb = 95,
            developer = "Sundial Games",
            shortDescription = "4X strategy with seasonal co-op campaigns.",
            description = "Expand your realm in a 4X strategy world with seasonal co-op campaigns, deep diplomacy, and tactical battles built for mobile.",
            tags = listOf("Strategy", "Co-op", "Seasonal"),
            screenshots = listOf("World map", "Battles", "Co-op"),
            isEditorsChoice = true
        ),
        PlayItem(
            id = "puzzle-echo",
            name = "Echo Blocks",
            category = "Puzzle",
            contentType = ContentType.GAME,
            rating = 4.8,
            downloads = "5M+",
            sizeMb = 68,
            developer = "Quiet Studio",
            shortDescription = "Soothing color-matching puzzles with music.",
            description = "Relax with color-matching puzzles synced to generative music. Hundreds of handcrafted stages, daily challenges, and offline play.",
            tags = listOf("Relaxing", "Offline", "Daily"),
            screenshots = listOf("Puzzle grid", "Daily run", "Themes"),
            badges = listOf("Editors' Choice")
        ),
        PlayItem(
            id = "rogue-run",
            name = "Rogue Run Zero",
            category = "Action",
            contentType = ContentType.GAME,
            rating = 4.1,
            downloads = "12M+",
            sizeMb = 120,
            developer = "Hyperbyte",
            shortDescription = "Fast roguelite runs with deck building.",
            description = "Dash through neon cities in bite-sized roguelite runs. Combine deck-building perks, bosses, and daily modifiers for endless replay.",
            tags = listOf("Roguelite", "Deck", "Controller"),
            screenshots = listOf("Boss fight", "Deck build", "Loot"),
            isNew = true
        ),
        PlayItem(
            id = "farm-valley",
            name = "Farm Valley",
            category = "Simulation",
            contentType = ContentType.GAME,
            rating = 4.5,
            downloads = "60M+",
            sizeMb = 70,
            developer = "Valley Soft",
            shortDescription = "Cozy farming with friends and market days.",
            description = "Grow crops, craft goods, and host market days with friends. Seasonal events, pets, and co-op building keep your valley lively.",
            tags = listOf("Cozy", "Multiplayer", "Events"),
            screenshots = listOf("Farm", "Marketplace", "Pets")
        ),
        PlayItem(
            id = "nova-arena",
            name = "Nova Arena",
            category = "Action",
            contentType = ContentType.GAME,
            rating = 4.3,
            downloads = "80M+",
            sizeMb = 110,
            developer = "Orbit Forge",
            shortDescription = "5v5 hero shooter with cross-play.",
            description = "Pick your hero and battle across compact arenas with cross-play and ranked queues. Seasonal battle passes and highlight reels included.",
            tags = listOf("Shooter", "5v5", "Cross-play"),
            screenshots = listOf("Arena", "Heroes", "Skins"),
            badges = listOf("Top charts")
        ),
        PlayItem(
            id = "myst-garden",
            name = "Myst Garden",
            category = "Adventure",
            contentType = ContentType.GAME,
            rating = 4.9,
            downloads = "3M+",
            sizeMb = 87,
            developer = "Storyseed",
            shortDescription = "Narrative exploration with branching endings.",
            description = "Explore a living garden of mysteries with branching endings, voiced characters, and light puzzles. Built to be finished in a weekend.",
            tags = listOf("Story-rich", "Offline", "Indie"),
            screenshots = listOf("Exploration", "Dialogue", "Endings"),
            isEditorsChoice = true
        ),
        PlayItem(
            id = "skyline-builder",
            name = "Skyline Builder",
            category = "Simulation",
            contentType = ContentType.GAME,
            rating = 4.2,
            downloads = "9M+",
            sizeMb = 130,
            developer = "North Star",
            shortDescription = "City builder with climate and traffic sims.",
            description = "Design skylines with deep climate, zoning, and traffic simulations. Share blueprints with the community and import mods.",
            tags = listOf("City", "Sandbox", "Builder"),
            screenshots = listOf("City view", "Transit", "Weather")
        ),
        // Media
        PlayItem(
            id = "film-orbit",
            name = "Film Orbit",
            category = "Movies",
            contentType = ContentType.MOVIE,
            rating = 4.6,
            downloads = "500K+",
            sizeMb = 6,
            price = "From $3.99",
            developer = "Orbit Media",
            shortDescription = "Rent or buy new releases in HDR and Dolby.",
            description = "Browse a rotating catalog of HDR and Dolby Atmos titles. Watchlists, smart recommendations, and offline playback for purchased content.",
            tags = listOf("HDR", "Dolby", "Offline"),
            screenshots = listOf("Home", "Playback", "Downloads")
        ),
        PlayItem(
            id = "docu-realms",
            name = "Docu Realms",
            category = "Documentary",
            contentType = ContentType.MOVIE,
            rating = 4.5,
            downloads = "250K+",
            sizeMb = 8,
            price = "Subscription",
            developer = "Realms Media",
            shortDescription = "Curated documentaries and miniseries.",
            description = "Stream curated documentaries, miniseries, and festival winners. Includes offline packs, commentary tracks, and watch parties.",
            tags = listOf("Documentary", "Offline", "Curated"),
            screenshots = listOf("Collections", "Detail", "Player")
        ),
        PlayItem(
            id = "page-turner",
            name = "Page Turner",
            category = "Books",
            contentType = ContentType.BOOK,
            rating = 4.7,
            downloads = "1M+",
            sizeMb = 18,
            price = "From $4.99",
            developer = "Turner Reads",
            shortDescription = "Audiobooks, ebooks, and synced highlights.",
            description = "Enjoy audiobooks and ebooks with synced highlights, sleep timers, and offline shelves. Personalized collections refresh weekly.",
            tags = listOf("Audiobook", "Ebook", "Sync"),
            screenshots = listOf("Reader", "Library", "Highlights")
        ),
        PlayItem(
            id = "cosmic-reads",
            name = "Cosmic Reads",
            category = "Sci-fi",
            contentType = ContentType.BOOK,
            rating = 4.8,
            downloads = "420K+",
            sizeMb = 12,
            price = "Subscription",
            developer = "Cosmic Press",
            shortDescription = "Serialized sci-fi and fantasy originals.",
            description = "Serialized sci-fi and fantasy with weekly drops, offline chapters, and community annotations.",
            tags = listOf("Fantasy", "Serial", "Offline"),
            screenshots = listOf("Chapters", "Community", "Audio")
        ),
        PlayItem(
            id = "mindful-shorts",
            name = "Mindful Shorts",
            category = "Health",
            contentType = ContentType.MOVIE,
            rating = 4.2,
            downloads = "150K+",
            sizeMb = 7,
            developer = "Rest Labs",
            shortDescription = "5-minute mindfulness films and exercises.",
            description = "Quick mindfulness films paired with guided exercises. Designed for breaks and commutes, with downloads for offline use.",
            tags = listOf("Mindfulness", "Short form", "Offline"),
            screenshots = listOf("Guide", "Download", "Progress")
        )
    )

    val apps = allItems.filter { it.contentType == ContentType.APP }
    val games = allItems.filter { it.contentType == ContentType.GAME }
    val media = allItems.filter { it.contentType == ContentType.MOVIE }
    val books = allItems.filter { it.contentType == ContentType.BOOK }

    val editorsChoice = allItems.filter { it.isEditorsChoice }
    val newAndUpdated = allItems.filter { it.isNew || it.badges.contains("New") }

    val topFreeGames = games.take(5)
    val topFreeApps = apps.take(5)
    val trendingCollections = listOf(
        Collection(
            id = "work",
            title = "Work essentials",
            subtitle = "Stay organized, focused, and secure",
            items = apps.filter { it.category in listOf("Productivity", "Communication") }
        ),
        Collection(
            id = "creative",
            title = "Create & capture",
            subtitle = "Tools for artists and creators",
            items = apps.filter { it.category in listOf("Art & Design", "Photography") }
        ),
        Collection(
            id = "winddown",
            title = "Unwind & recover",
            subtitle = "Mindfulness, sleep, and calm games",
            items = allItems.filter { it.tags.contains("Offline") || it.category == "Health & Fitness" }
        ),
        Collection(
            id = "weekend",
            title = "Weekend picks",
            subtitle = "Narrative adventures and co-op sims",
            items = games.filter { it.category in listOf("Adventure", "Simulation") }
        )
    )

    data class Collection(
        val id: String,
        val title: String,
        val subtitle: String,
        val items: List<PlayItem>
    )
}

# OPPO Play

A full-stack mobile app store clone with Android client and web admin panel.

## Tech Stack

### Android Client (`android/`)
- **Language**: Kotlin
- **UI**: Jetpack Compose
- **Architecture**: MVVM with ViewModels
- **Networking**: Retrofit + Moshi
- **Image Loading**: Coil

### Web Server (`server/`)
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **UI**: React + Tailwind CSS
- **API**: RESTful endpoints under `/api`

## Project Structure

```
oppo-play/
├── android/          # Android client
│   ├── app/          # Main application module
│   └── gradle/       # Gradle wrapper
└── server/           # Web server & admin panel
    ├── src/app/      # Next.js pages & API routes
    ├── prisma/       # Database schema & migrations
    └── public/       # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Android Studio (for Android development)

### Server Setup

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

Server runs at `http://localhost:3000`

### Android Setup

1. Open `android/` folder in Android Studio
2. Update `BASE_URL` in `ApiService.kt` to your server IP
3. Run on device/emulator

## Features

- App catalog with categories and search
- User authentication (login/register)
- Remote app installation via web admin
- Download progress tracking
- User reviews and ratings
- Wishlist management
- Download history

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/apps` | List apps (paginated) |
| `GET /api/admin/apps/:id` | App details |
| `POST /api/devices` | Register device |
| `GET /api/install-requests` | Get install tasks |
| `POST /api/install-requests` | Create install task |
| `POST /api/user` | Auth (login/register) |
| `GET /api/reviews` | Get app reviews |

## License

MIT

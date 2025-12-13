# Admin Dashboard - OPPO Play Store Clone

## Overview

A comprehensive admin dashboard for managing the Play Store clone application. Built with Next.js 15, TypeScript, Tailwind CSS, and Prisma.

## Features

### 1. Dashboard (/)
- **Statistics Cards**: Overview of key metrics
  - Total Apps
  - Devices (online/offline)
  - Install Tasks (total/pending)
  - Average Rating
- **Category Distribution Chart**: Visual breakdown of apps by category
- **Recent Activity Feed**: Latest system activities
- **Recently Added Apps**: List of newest apps
- **Top Rated Apps**: Highest-rated apps

### 2. Apps Management (/admin/apps)
- **Data Table** with advanced features:
  - Search functionality (by title, developer)
  - Category filtering
  - Pagination (10 items per page)
  - Sorting capabilities
- **CRUD Operations**:
  - Add new apps (modal form)
  - Edit existing apps (modal form)
  - Delete apps (with confirmation)
- **Display Information**:
  - App icon, title, developer
  - Category, rating, downloads
  - Version, size

### 3. Device Management (/admin/devices)
- **Overview Stats**:
  - Total devices
  - Active devices
  - Total installs
- **Device Cards** showing:
  - Device name and status (online/offline)
  - Platform and OS version
  - App version
  - Install count
  - Last seen timestamp

### 4. Install Task Management (/admin/tasks)
- **Status Overview**:
  - Total, Queued, In Progress, Completed, Failed
- **Task Table** with:
  - App details (icon, title, developer)
  - Device information
  - Status badges with icons
  - Progress bars
  - Timestamps (created, updated)

### 5. Settings (/admin/settings)
- **General Settings**: Store name, admin email
- **Database**: Connection status, backup options
- **API**: Endpoint configuration, rate limiting
- **Security**: 2FA, auto-logout, password change

## Design Features

### Material Design
- Clean, modern Google Play Console-inspired interface
- Consistent spacing and typography
- Elevation with subtle shadows
- Color-coded status indicators

### Dark Mode Support
- Seamless theme switching
- Uses CSS custom properties
- Preserves light mode aesthetics
- OLED-friendly true black backgrounds

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly buttons (44px min)
- Adaptive layouts for all screen sizes

### Color System
```css
--primary-blue: #1a73e8
--background: #ffffff (light) / #000000 (dark)
--surface: #ffffff (light) / #131314 (dark)
--surface-variant: #f8f9fa (light) / #2d2e31 (dark)
--ink: rgba(0,0,0,0.87) (light) / #e8eaed (dark)
--ink-secondary: rgba(0,0,0,0.54) (light) / #9aa0a6 (dark)
--border: #dadce0 (light) / #3c4043 (dark)
```

### Status Colors
- Blue (#1a73e8): In Progress, Info
- Green (#4caf50): Success, Online, Completed
- Red (#f44336): Error, Offline, Failed
- Amber (#ffc107): Warning, Pending
- Purple (#9c27b0): Install Tasks
- Gray (#5f6368): Queued, Inactive

## Components

### AdminLayout
- Sidebar navigation with icons
- Top bar with theme toggle and store link
- Responsive drawer on mobile
- User profile section

### AppsTable
- Client-side search and filtering
- Modal forms for add/edit operations
- Dropdown menus for actions
- Image loading with Next.js Image

### Statistics Cards
- Icon-based visual indicators
- Trend indicators (+/- percentages)
- Subtitle support for additional info

### Progress Bars
- Animated transitions
- Status-based coloring
- Percentage labels

## API Routes

### GET /api/admin/apps
Fetch all apps

### POST /api/admin/apps
Create new app
```json
{
  "title": "App Name",
  "developer": "Developer Name",
  "category": "Apps",
  "rating": 4.5,
  "downloads": "1M+",
  "size": "50 MB",
  "version": "1.0.0",
  "description": "App description"
}
```

### GET /api/admin/apps/[id]
Fetch single app

### PUT /api/admin/apps/[id]
Update app (partial updates supported)

### DELETE /api/admin/apps/[id]
Delete app (cascades to reviews, screenshots, install tasks)

## Access

Navigate to `/admin` from the main store or use the "Admin" button in the header.

## Database Schema

The admin dashboard uses the existing Prisma schema with:
- **App**: Main app data
- **Device**: Connected devices
- **RemoteInstallTask**: Installation tracking
- **Review**: User reviews
- **Screenshot**: App screenshots

## Dependencies

### New
- `date-fns`: Date formatting and relative times

### Existing
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma
- Lucide React (icons)

## Future Enhancements

1. **Analytics**: Charts for downloads, ratings over time
2. **Bulk Operations**: Multi-select and batch actions
3. **Search**: Advanced filtering with multiple criteria
4. **Export**: CSV/JSON export of data
5. **Logs**: Activity logs and audit trails
6. **Notifications**: Real-time updates for install tasks
7. **User Management**: Multi-admin support with roles
8. **Review Moderation**: Approve/reject reviews
9. **App Upload**: Direct APK upload and parsing
10. **Device Commands**: Remote commands to devices

## Security Considerations

- Add authentication middleware
- Implement CSRF protection
- Add rate limiting to API routes
- Validate all inputs server-side
- Use environment variables for sensitive data
- Implement proper session management

## Performance

- Server-side rendering for initial load
- Client-side pagination and filtering
- Optimized images with Next.js Image
- Minimal bundle size with tree-shaking
- Database query optimization with Prisma

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Reduced motion support
- High contrast in dark mode

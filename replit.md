# SocialSync - Social Media Management Platform

## Overview

SocialSync is a comprehensive social media management platform that allows users to compose, schedule, and analyze posts across multiple social platforms (Twitter, Instagram, Facebook, and Bluesky) from a single interface. The application features a modern, responsive UI built with React and Tailwind CSS, with a server-side Express backend. It uses Drizzle ORM for database operations with PostgreSQL as the underlying database system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React, utilizing a component-based architecture organized into pages and reusable components. Key technologies include:

1. **React**: Core library for building the UI
2. **TanStack Query (React Query)**: For data fetching, caching, and state management
3. **Wouter**: Lightweight routing library
4. **Tailwind CSS**: Utility-first CSS framework for styling
5. **Shadcn UI**: Component library based on Radix UI primitives
6. **Recharts**: For data visualization in analytics
7. **Date-fns**: For date manipulation and formatting

The frontend is organized into:
- Pages (dashboard, compose, schedule, analytics)
- Components (UI components, layout components, feature-specific components)
- Hooks (custom React hooks)
- Lib (utility functions)

### Backend Architecture

The backend is a Node.js Express server that:
1. Serves the React frontend in production
2. Provides RESTful API endpoints for client-server communication
3. Handles database operations via Drizzle ORM
4. Manages sessions and authentication

### Database Architecture

The application uses Drizzle ORM with PostgreSQL for data persistence. The database schema includes:

1. **Users**: Store user information and credentials
2. **Connected Platforms**: Track which social platforms the user has connected
3. **Posts**: Store post content and metadata
4. **Post Platforms**: Track which platforms each post is published to
5. **Analytics**: Store engagement metrics for posts

### Authentication System

The authentication system is built using sessions with PostgreSQL as the session store (`connect-pg-simple`). This allows for secure, stateful sessions while maintaining scalability.

## Key Components

### UI Component Library

The application uses a comprehensive set of UI components built on top of Radix UI primitives, following the Shadcn UI approach. These components provide consistent styling, accessibility, and interaction patterns across the application.

### Pages

1. **Dashboard**: Main hub showing an overview of connected platforms, quick post composer, schedule preview, and analytics summary
2. **Compose**: Full-featured post composer with platform-specific previews
3. **Schedule**: Calendar and list views of scheduled posts with management capabilities
4. **Analytics**: In-depth analytics and data visualization for post performance

### API Structure

RESTful API endpoints are organized around:
- User management (`/api/user`)
- Platform connections (`/api/platforms`)
- Post management (`/api/posts`)
- Scheduled posts (`/api/posts/scheduled`)
- Analytics (`/api/analytics`)

## Data Flow

1. **Post Creation**:
   - User composes a post in the UI
   - Selects platforms to publish to
   - Sets schedule time (optional)
   - Frontend sends data to backend API
   - Backend stores post in database
   - Post is published immediately or saved for scheduled publishing

2. **Post Retrieval**:
   - Frontend requests posts from backend API
   - Backend queries database for posts
   - Backend augments posts with platform-specific data
   - Data is returned to frontend for display

3. **Analytics**:
   - Engagement data is fetched from social platforms
   - Data is stored in analytics table
   - Frontend requests analytics data from backend
   - Backend processes data into visualization-ready format
   - Frontend displays data using Recharts

## External Dependencies

### Frontend Dependencies

- React ecosystem (react, react-dom)
- Tanstack Query for data fetching
- Wouter for routing
- Tailwind CSS for styling
- Shadcn UI / Radix UI for UI components
- Recharts for data visualization
- Date-fns for date handling

### Backend Dependencies

- Express for the server framework
- Drizzle ORM for database operations
- PostgreSQL for data storage
- Connect-pg-simple for session management
- Zod for schema validation

### Third-Party Services

- Social media platform APIs (Twitter, Instagram, Facebook, Bluesky)
- Neon Database (implied by @neondatabase/serverless dependency)

## Deployment Strategy

The application is configured for deployment on Replit, with specific scripts for development and production:

### Development
- Uses `npm run dev` to run the server in development mode with hot reloading
- Server serves both the API and the frontend via Vite's development server

### Production
- Build process combines:
  - Frontend build with Vite (`vite build`)
  - Backend build with esbuild
- Production server runs from the built files
- Static assets are served from the `dist/public` directory

The build output is optimized for deployment on Replit's infrastructure, with appropriate port configurations (5000 internally, exposed as 80 externally).

## Getting Started

To run the application:

1. Ensure PostgreSQL is provisioned and the `DATABASE_URL` environment variable is set
2. Install dependencies with `npm install`
3. Run in development mode with `npm run dev`
4. For production, build with `npm run build` and start with `npm run start`

## Database Setup

The database schema is defined in `shared/schema.ts` and can be pushed to the database with:

```
npm run db:push
```

This will create all the necessary tables based on the Drizzle schema definitions.
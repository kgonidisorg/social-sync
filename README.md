# SocialSync - Social Media Management Platform

## Table of Contents

- [SocialSync - Social Media Management Platform](#socialsync---social-media-management-platform)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Project Layout](#project-layout)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Deployment](#deployment)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
    - [Contributing](#contributing)
    - [License](#license)

## Overview

SocialSync is a comprehensive social media management platform that allows users to compose, schedule, and analyze posts across multiple social platforms (Twitter, Instagram, Facebook, and Bluesky) from a single interface. The application features a modern, responsive UI built with React and Tailwind CSS, with a server-side Express backend. It uses Drizzle ORM for database operations with PostgreSQL as the underlying database system.

## Features

- **Post Management**: Compose, schedule, and publish posts to multiple platforms.
- **Analytics**: View engagement metrics and performance insights for posts.
- **Platform Integration**: Connect and manage multiple social media accounts.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Project Layout

```text
.
├── client/                  # Frontend code
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Application pages
│   │   ├── App.tsx          # Main application component
│   │   ├── main.tsx         # Application entry point
│   │   └── index.css        # Global styles
│   └── index.html           # HTML template
├── server/                  # Backend code
│   ├── db.ts                # Database connection
│   ├── routes.ts            # API routes
│   ├── storage.ts           # File storage logic
│   └── index.ts             # Server entry point
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Database schema
├── .config/                 # Configuration files
├── Dockerfile               # Docker configuration
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

## Tech Stack

### Frontend
- **React**: Core library for building the UI
- **TanStack Query**: Data fetching and caching
- **Wouter**: Lightweight routing library
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library based on Radix UI primitives
- **Recharts**: Data visualization
- **Date-fns**: Date manipulation and formatting

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web server framework
- **Drizzle ORM**: Database operations
- **PostgreSQL**: Database system
- **Connect-pg-simple**: Session management
- **Zod**: Schema validation

### Deployment
- **Replit**: Development and deployment platform
- **Docker**: Containerization for production

## Installation

### Prerequisites
- Node.js 20.x
- PostgreSQL 16.x
- Docker (optional, for containerized deployment)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/socialsync.git
   cd socialsync

2. Install dependencies

```bash
npm install
```

3. Set up the database:
- Ensure PostgreSQL is running.
- Set the DATABASE_URL environment variable.
- Push the database schema:

```bash
npm run db:push
```

4. Run the application:

- Development mode:
```bash
npm run dev
```
- Production mode:
```bash
npm run build
npm run start
```

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License
This project is licensed under the MIT License.

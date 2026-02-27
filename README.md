# DevLog 

A developer journaling app to track what you build, learn, and struggle with every day. 

[Live Demo](https://devlog-woad.vercel.app")

## Features

- GitHub OAuth authentication
- Write and save daily developer journal entries
- Tag entries by topic (React, TypeScript, Bug Fix, etc.)
- Track your mood for each session
- Personal dashboard with stats
- AI-powered entry summaries *(coming soon)*
 

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Bootstrap 5 |
| Auth | NextAuth.js (GitHub OAuth) |
| ORM | Prisma 7 |
| Database | PostgreSQL (Neon) |
| AI | OpenAI API *(coming soon)* |
| Deployment | Vercel *(coming soon)* |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A GitHub OAuth App ([create one here](https://github.com/settings/developers))
- An OpenAI API key *(for AI summaries)*

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/devlog.git
   cd devlog
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables — create a `.env` file at the root:
   ```
   DATABASE_URL=your_neon_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GITHUB_ID=your_github_oauth_app_id
   GITHUB_SECRET=your_github_oauth_app_secret
   ```

4. Push the database schema
   ```bash
   npx prisma db push
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, Bootstrap, SessionProvider
│   ├── page.tsx                # Sign in page
│   ├── (app)/
│   │   ├── layout.tsx          # Auth guard, Sidebar layout
│   │   └── new/
│   │       └── page.tsx        # New entry form
│   └── api/
│       ├── auth/[...nextauth]/ # NextAuth route handler
│       └── entries/
│           └── route.ts        # GET and POST entry endpoints
├── components/
│   ├── Providers.tsx           # SessionProvider wrapper
│   └── Sidebar.tsx             # Navigation sidebar
├── lib/
│   ├── auth.ts                 # NextAuth config
│   └── prisma.ts               # Prisma client
└── types/
    └── index.ts                # TypeScript interfaces
```

## Database Schema

The app uses four models:

- **User** — stores profile info from GitHub OAuth
- **Entry** — journal entries with title, content, mood, and tags
- **Account** — links OAuth providers to users (managed by NextAuth)
- **Session** — active user sessions (managed by NextAuth)

## Notes for Developers

- Prisma 7 does not use `url = env("DATABASE_URL")` in `schema.prisma` — the connection string lives in `prisma.config.ts`
- Always run `npx prisma generate` after schema changes
- Import Prisma client with curly braces: `import { prisma } from '@/lib/prisma'`

## Roadmap

- [ ] All entries list page
- [ ] Individual entry view
- [ ] AI-powered entry summaries using OpenAI
- [ ] Dashboard with writing stats
- [ ] Vercel deployment

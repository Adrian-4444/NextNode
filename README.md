# Dual Mind Escape

A two-player collaborative tech puzzle hunt game built with Next.js, React, and PostgreSQL.

## Features
- **Co-Op Operative Mode:** Allows two players ("Decoder" and "Analyst") to play simultaneously on separate devices.
- **Persistent Progress:** The game state is stored locally so players won't lose their place if they refresh the page.
- **Database Leaderboard:** Automatically logs the completion time and team name into a PostgreSQL database upon finishing the final puzzle.

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Setup Environment Variables:**
   Create a `.env.local` file in the root directory and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgres://user:password@host:port/database"
   ```
   *(Note: The game will still work locally without a database, but it won't save completion times).*
3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Deployment

This app is built with Next.js App Router and is fully optimized for zero-config deployment to platforms like Vercel or Netlify.

### Deploying to Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. **Important:** In the "Environment Variables" section, add a new variable named `DATABASE_URL` and paste your PostgreSQL connection string. (If you don't have one, Vercel offers a free fully-managed Postgres database under the "Storage" tab).
5. Click **Deploy**.

Vercel will automatically detect that it is a Next.js project and run the build command (`next build`). 

### Deploying to Netlify
1. Connect your repository to Netlify.
2. Set the Build Command to `npm run build` and the Publish Directory to `.next`.
3. Add `DATABASE_URL` in the Environment Variables under "Site Settings".
4. Deploy the site.

## Architecture
- `src/app/page.tsx`: Landing page containing role selection and team logic.
- `src/app/game/page.tsx`: Core game engine handling puzzle validation and UI.
- `src/data/puzzles.ts`: The static puzzles dataset.
- `src/app/api/scores/route.ts`: API Endpoint hitting PostgreSQL to store victory stats.
- `src/lib/db.ts`: PostgreSQL Connection Pooling (`pg`).

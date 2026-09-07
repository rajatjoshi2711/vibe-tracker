# Vibe Tracker

Track your vibe coding projects: existing projects, feature ideas for them, and standalone new project ideas. Everything has a name, an optional description, and an optional prompt, and can be struck off once it's done.

Built with Next.js (App Router), Prisma, Neon Postgres, and NextAuth (email + password).

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Neon Postgres database at [neon.tech](https://neon.tech) (or `vercel storage create` if using the Vercel-Neon integration). Copy the pooled connection string and the direct connection string.

3. Copy `.env.example` to `.env` and fill in:

   ```bash
   DATABASE_URL="<pooled Neon connection string>"
   DIRECT_URL="<direct Neon connection string>"
   AUTH_SECRET="<generate with: npx auth secret>"
   ```

4. Push the schema to your database:

   ```bash
   npx prisma db push
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000`, create an account, and start adding projects.

## Deploying to Vercel

1. Push this repo to GitHub (already wired to `https://github.com/rajatjoshi2711/vibe-tracker`).
2. Import the repo into Vercel.
3. Add the Neon integration (or paste `DATABASE_URL` / `DIRECT_URL` manually) and set `AUTH_SECRET` in the Vercel project's environment variables.
4. Deploy. Prisma's `postinstall` script (`prisma generate`) runs automatically on build.
5. After the first deploy, run `npx prisma db push` locally (pointed at the production `DATABASE_URL`) to create the tables, or wire it into a release step.

## Data model

- **Project** — an existing project you're tracking. Has a name, description, prompt, and a done flag.
- **Idea** — either a feature idea tied to a project (`projectId` set) or a standalone new-project idea (`projectId` is null). Same shape as a project: name, description, prompt, done.

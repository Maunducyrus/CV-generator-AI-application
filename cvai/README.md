# CV AI Builder

AI-powered CV and cover letter builder using Next.js 14, Tailwind, Prisma (SQLite), and OpenAI.

## Features
- Multi-step builder with live preview
- AI CV and cover letter generation
- Job tailoring (paste JD), summary suggestions
- Save, version-ready schema, share public link
- Export: PDF, DOCX, TXT
- Auth: credentials (register/sign in)

## Requirements
- Node.js 18+
- OpenAI API key (set in `.env`)

## Setup
```bash
npm install
cp .env.example .env
# edit .env and add OPENAI_API_KEY
npx prisma migrate dev
npm run dev
```

## Scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – start production server
- `npm run prisma:migrate` – migrate
- `npm run prisma:studio` – open Prisma Studio

## Environment
- `DATABASE_URL` – default SQLite file
- `NEXTAUTH_SECRET` – any random string in dev
- `NEXTAUTH_URL` – e.g. http://localhost:3000
- `OPENAI_API_KEY` – your OpenAI key

## Deployment (Vercel)
1. Push repo to GitHub
2. Import in Vercel
3. Add env vars above
4. Set Node.js 18+ runtime
5. Deploy

## Notes
- For DOCX/PDF exports, routes run on Node runtime.
- Content stored as JSON string in database for SQLite compatibility.
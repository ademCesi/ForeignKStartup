# Backend (Core phase)

Express + PostgreSQL API for the foreign entrepreneur helper app. See the monthly report /
API spec for the full endpoint list; this covers the Core-phase routes only (auth, roadmap,
visas, services, and the authenticated `/me/*` routes). Advanced-phase tables (funding
programs, glossary, notifications, FAQ) aren't modeled yet.

## Setup

```bash
cp .env.example .env
docker compose up -d      # starts Postgres on localhost:5432
npm install
npm run db:migrate        # applies db/schema.sql
npm run db:seed           # loads db/seed.sql reference data
npm run dev                # starts the API on http://localhost:4000
```

## Notes

- Auth is stateless JWT (`Authorization: Bearer <token>`), 30-day expiry.
- `db/seed.sql` truncates and reloads all reference tables — safe to re-run.
- Office coordinates in the seed data are indicative (city-block level), good enough for
  the office finder list/distance UI; refine with real geocoding before shipping.

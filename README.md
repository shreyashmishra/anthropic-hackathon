# OpenFloor

OpenFloor is a civic video platform for the Governance & Collaboration track. It helps people
understand long political and public-interest recordings by turning them into timestamped summaries,
notable statements, clip-based discussions, and source-aware public threads.

The current repo includes:

- A Next.js + TypeScript + Tailwind app shell
- Built-in demo-user access for posting and participation
- Gemini-powered video processing hooks for transcript analysis and clip generation
- Drizzle ORM with a lightweight SQLite-backed local prototype
- Public browsing for videos, clips, sources, and topics
- Local-storage utilities for draft comments, UI preferences, and recently viewed content

## Product Direction

OpenFloor is designed to:

- Make civic video easier to understand
- Preserve provenance and surrounding context
- Distinguish official-source content from user submissions
- Support constructive, threaded public discussion
- Reduce decontextualized outrage bait

The detailed product blueprint lives in [docs/openfloor-blueprint.md](docs/openfloor-blueprint.md).

## Getting Started

1. Copy `.env.example` to `.env` and fill in Gemini and optional demo-user labels.
2. Install dependencies with `npm install`.
3. Push the local schema with `npm run db:push`.
4. Start the app with `npm run dev`.

Then open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run db:push
```

## Notes

- The current implementation uses SQLite for local development speed. The blueprint recommends
  PostgreSQL for deployed shared environments.
- `npm run lint` is still not wired up with an ESLint dependency/config in this repo.

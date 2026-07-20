This package is based on commit ec33c78 (the desired Codex-changed version),
with only the build-repair files overlaid from the later fixed build.
It is intended to preserve the Codex UI/content changes while restoring a successful Vercel build.

Included fixes:
- restored lib/supabase/*.ts and lib/autobot/supabaseClient.ts
- repaired broken AutoBot pages and route handlers
- normalized key component/type imports
- excluded backup jobday_autobot_* files from TypeScript build via tsconfig.json

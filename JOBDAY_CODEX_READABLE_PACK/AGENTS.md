# JOBDAY repository instructions

## Read before every task
1. Read `CODEX_START_HERE.md`.
2. Read `docs/00_JOBDAY_MASTERPLAN_V3.md`.
3. Read `docs/01_UX_UI_SUPER_MASTER_SPEC.md`.
4. Inspect the actual repository, routes, package scripts, migrations, RLS policies, tests and deployment settings.

## Source of truth
- The repository code is the truth about what currently exists.
- The two numbered documents above are the truth about the target product and UX direction.
- When code and documents conflict, report the conflict. Do not silently choose or rewrite large areas.
- Do not treat plans, mockups, inaccessible URLs or unrun tests as completed work.

## Scope control
- Do not build the entire platform in one task.
- The first task is audit and planning only unless the user explicitly approves prototype implementation.
- Keep Community, Jobs, Shop, Ads, Membership and native payments behind feature flags until their phase is approved.
- Preserve useful existing code and patterns. Do not rewrite Auth, database schema or routing without an approved migration plan.

## Product rules
- `Occupation` is the common organizing object.
- The user-facing journey is: listen/watch → explore an occupation → ask or find a job.
- Community, commerce and advertising must appear in relevant occupational context, not as disconnected portal sections.
- The product must feel like a polished, human-centered editorial media platform, not an industrial or government job board.
- Use real Korean content lengths; do not use lorem ipsum, fake metrics or fake reviews.

## Trust, privacy and security
- Protect sensitive data with server authorization and Supabase RLS.
- Store identity evidence, resumes, appearance consent forms, private contacts and report evidence privately.
- AI may assist with drafting, classification and risk flags, but may not independently publish content, verify employers, permanently ban users or make legal decisions.
- Log important moderation, verification, role, advertising and publishing actions.
- Do not expose unverified employers, public blacklists, manual recruitment matching, success fees or sensitive status information.

## Quality
- Every implementation plan must state scope, exclusions, permissions, states, analytics, tests, browser verification and rollback.
- Test mobile widths 360, 390 and 430px as well as desktop.
- Run the repository's actual lint, typecheck, test and build commands. Report failures exactly.
- Do not claim completion without evidence.

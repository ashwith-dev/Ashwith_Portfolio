# Portfolio Build Progress

## Status

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — Scaffold | ✅ Done | Next.js 16.4.2, TypeScript, Tailwind, all deps installed |
| Phase 1 — Database | ✅ Done | All 5 models, seed script with real content |
| Phase 2 — Auth | ✅ Done | JWT + bcrypt, proxy.ts (v16), login page, rate limiting |
| Phase 3 — Content APIs | ✅ Done | All CRUD routes + upload sign endpoint |
| Phase 4 — Public portfolio | ✅ Done | All pages + GSAP animations (push intro, pull quote, skills line-art, horizontal projects) |
| Phase 5 — Admin panel | ✅ Done | Login + dashboard + profile, projects, skills, experience, messages |
| Phase 6 — Hardening | ✅ Done | Rate limiting, honeypot, error handling, build passes |
| Phase 7 — Deploy | ⏳ Pending | Waiting on env vars from owner |

## Key decisions

- **Next.js 16**: Uses `proxy.ts` instead of `middleware.ts`; all `params`/`cookies()` are async
- **`cacheComponents`** disabled — conflicts with `export const revalidate` ISR; using standard ISR instead
- **DB connection** deferred to runtime (not module load) so the build succeeds without `MONGODB_URI`
- **Push intro** is scroll-scrubbed (pinned for 180% of viewport height, rewinds on scroll-up), per PLAN.md 9.4: an original line-art character pushes an `--ink` wall right, and the wall's edge is the `--paper` clip that reveals the name. One GSAP timeline drives the clip, the character's position and every joint, so the hands stay on the wall edge.
- **Home page after the intro** follows the Crosswalk reference's structure with the owner's own content (PLAN.md 9.1: no copied text/assets): sticky accent hero with a skill-area network diagram → about statement slides over it → skills columns → experience rows → "Currently building" (dark) → pinned textured pull quote with a stepped ink wipe → pinned horizontal projects → contact. No photos exist yet; image slots show project covers in grayscale, and a generated line-art plate until one is uploaded.
- **Pin order**: the intro's pin is created after fonts load, so it has `refreshPriority: 1` plus `ScrollTrigger.sort()` — otherwise later pins ignore its spacer and fire early.
- **Animations**: GSAP + ScrollTrigger for pin/scrub, Lenis for smooth scroll; all wrapped in `gsap.context()` with cleanup on unmount; reduced-motion fallback skips pinning

## Open questions / owner to-do

1. Add `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `CLOUDINARY_*` to Vercel environment variables
2. Run `npx tsx scripts/hash-password.mts <yourpassword>` to generate the bcrypt hash
3. Run `npx tsx scripts/seed.mts` (locally with `.env` set) to populate the DB with your content
4. Add LinkedIn and GitHub URLs to your profile from the admin panel after first login
5. Upload a profile photo via admin → Profile → Avatar URL (Cloudinary upload)
6. Upload your resume PDF via admin → Profile → Resume URL

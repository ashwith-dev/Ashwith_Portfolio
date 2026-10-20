# Portfolio + Admin CMS: Execution Plan

> Drop this file in the root of the repo. Claude Code should read it fully before writing any code, then work through the phases in order.

---

## 1. What we are building

A personal portfolio website for **Ashwith** (2nd-year BS Applied AI & Data Science student; software and AI focused; mobile/UI developer and designer working in React Native and SwiftUI).

The site has two halves:

1. **Public portfolio** — fast, polished, mobile-first pages showing profile, projects (with case-study pages), skills, experience, and contact.
2. **Private admin panel** at `/admin` — a login-protected dashboard where the owner can add, edit, delete, reorder, and publish all portfolio content (profile, projects, skills, experience, images, resume PDF) **without touching code or redeploying**.

**Core goal:** after the initial build, every content change is done from the admin panel in the browser.

## 2. Hard constraints

- **Zero budget.** Only free tiers. No paid services, no credit card requirements.
- **No always-on server.** Free Express hosts (Render, Railway, Fly.io, Koyeb) are not available. The backend must run as **serverless functions inside Next.js on Vercel**.
- **Vercel Hobby plan** (personal, non-commercial use).
- **Single admin user** (the owner). No public signup, ever.
- Public pages must load fast and must never wait on a sleeping server.

## 3. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | UI and API in one project |
| Styling | **Tailwind CSS** | Design tokens defined once |
| Database | **MongoDB Atlas (free M0) + Mongoose** | Cached connection (serverless) |
| Images / PDF | **Cloudinary (free)** | Signed direct uploads from the browser |
| Auth | **bcryptjs + jose (JWT in httpOnly cookie)** | Single admin from env vars |
| Validation | **zod** | Validate every API input |
| Motion | **GSAP + ScrollTrigger**, **Lenis** | Scroll-scrubbed intro, pinned sections, smooth scroll (client components only) |
| Fonts | **next/font/google**: Doto, Geist, Geist Mono | Self-hosted at build time, no layout flicker |
| Hosting | **Vercel** | Env vars set in the dashboard |

> **Version check:** before coding, check the installed Next.js version and follow its current conventions (async `cookies()`/`params`, and in Next 16+ `middleware.ts` may be named `proxy.ts`). Do not rely on memory for version-specific APIs.

## 4. Architecture

```
Visitor ──► Next.js pages (server components, cached/ISR) ──► MongoDB Atlas
Admin  ──► /admin UI ──► /api/* route handlers (JWT-protected) ──► MongoDB Atlas
                    └──► Cloudinary (signed upload, browser → Cloudinary directly)
After any admin write ──► revalidatePath/revalidateTag ──► public pages refresh instantly
```

Key decisions:
- Public pages are **server-rendered from the DB with caching**, then **revalidated on admin save**. Visitors get static-fast pages; edits go live without a redeploy.
- **GET** content endpoints are public; **POST/PUT/DELETE** require a valid admin JWT, checked inside each route handler (never rely on middleware alone).
- **Image uploads go straight from the browser to Cloudinary** using a signature from `/api/upload/sign`. This avoids Vercel's request-body size limit (~4.5 MB) on serverless functions.

## 5. Data models (Mongoose)

**Profile** (single document)
`name, tagline, heroTagline, bio, pullQuote, currentlyBuilding[], location, email, resumeUrl, avatarUrl, socials[{label,url}]`

**Project**
`title, slug (unique), summary, description (markdown), role, techStack[], images[{url,alt}], coverImage, liveUrl, githubUrl, featured (bool), published (bool), order (number), createdAt, updatedAt`

**Skill**
`name, category (e.g. Mobile, Frontend, Backend, AI/Data, Design, Tools), level (optional), order`

**Experience** (also used for education, internships, achievements)
`title, organization, type, startDate, endDate (nullable = present), description, order`

**Message** (contact form submissions)
`name, email, message, createdAt, read (bool)`

Add sensible indexes (`slug`, `order`, `published`).

## 6. Folder structure

```
src/
  app/
    page.tsx                     # public home (hero, featured projects, skills, experience, contact)
    projects/page.tsx            # all projects
    projects/[slug]/page.tsx     # case study
    admin/
      login/page.tsx
      page.tsx                   # dashboard overview
      profile/page.tsx
      projects/page.tsx          # list + create/edit/delete/reorder
      projects/[id]/page.tsx
      skills/page.tsx
      experience/page.tsx
      messages/page.tsx
    api/
      auth/login/route.ts
      auth/logout/route.ts
      profile/route.ts
      projects/route.ts
      projects/[id]/route.ts
      skills/route.ts
      skills/[id]/route.ts
      experience/route.ts
      experience/[id]/route.ts
      messages/route.ts          # POST public (rate-limited), GET admin
      upload/sign/route.ts       # Cloudinary signature (admin only)
  components/                    # ui/, portfolio/, admin/
  lib/
    db.ts                        # cached mongoose connection
    auth.ts                      # sign/verify JWT, requireAdmin()
    validators.ts                # zod schemas
    rate-limit.ts
  models/                        # Profile, Project, Skill, Experience, Message
middleware.ts (or proxy.ts)      # redirect unauthenticated /admin/* to /admin/login
```

## 7. Security requirements (non-negotiable)

- No signup route. Admin credentials come from env vars only.
- Password compared with **bcrypt**; session is a signed **JWT in an `httpOnly`, `secure`, `sameSite=lax` cookie** with an expiry.
- Every write route calls `requireAdmin()` and validates input with **zod**.
- **Login rate limiting** and a basic rate limit on the contact form (plus a honeypot field).
- Never log or return secrets. Never commit `.env*` files. Maintain `.env.example` with placeholder values.
- Sanitize/escape any user-submitted text before rendering (contact messages).
- Note: bcrypt hashes contain `$`; store `ADMIN_PASSWORD_HASH` in a way that survives `.env` parsing (escape `\$` locally, or base64-encode it and decode in code).

## 8. Environment variables

```
MONGODB_URI=
JWT_SECRET=                 # long random string
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_SITE_URL=
```

## 9. Visual design and motion

### 9.1 Direction
- A **software and AI** portfolio: technical, sharp, modern, restrained. Not fashion or luxury.
- Overall feel: the clarity of Linear, Vercel, and Raycast. Personal-portfolio references: Rauno Freiberg (rauno.me), Emil Kowalski (emilkowal.ski), Lee Robinson (leerob.com), Brittany Chiang (brittanychiang.com).
- Motion references (owner's screen recordings, not in the repo): the **Huy Phan** site intro (a panel is pushed open and reveals the name) and the **Crosswalk** site (crosswalk.cl: large headings, numbered sections, pinned horizontal cards, pull quotes, line-art that draws on scroll, full-colour contact section).
- **Take the ideas, not the assets.** Never copy their text, photos, illustrations, characters, or code. All visuals must be original.

### 9.2 Palette (design tokens)
Define as CSS variables and map into the Tailwind theme so the whole site can be re-themed by changing one block.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0C0E` (graphite) | Dark sections, text on light |
| `--paper` | `#F2F3F5` | Light sections, text on dark |
| `--accent` | `#3D5AFE` (electric blue) | Label tags, links, focus, name colour shift, contact section |
| `--on-accent` | `#FFFFFF` | Text on accent |
| `--muted` | `#5B5F66` | Secondary text on paper |

- Alternative accent (one-variable swap): signal amber `#FFB020` with `--ink` text on top.
- Use the accent sparingly (roughly 10% of the surface): label tags, the final contact section, links, focus rings, and the name's colour shift.
- Section flow: ink (intro) → paper → ink (projects) → ink or paper (quote, skills) → accent (contact).
- Provide full light and dark modes. In dark mode, paper surfaces become ink and text flips; the accent stays.
- Verify WCAG AA contrast for every text and background pairing.

### 9.3 Typography
- **Name (hero only):** **Doto** (Google Fonts, variable dot-matrix). Use only for the large name and optionally huge section numerals. Never below about 28px; dot-matrix is hard to read small. If Doto feels too gimmicky in practice, fall back to **Syne** ExtraBold.
- **Headings and body:** **Geist**.
- **Labels, numbers, tags (e.g. `01 / projects`):** **Geist Mono**.
- Load with `next/font/google` (latin subset, `display: swap`); preload only fonts used above the fold. Provide system fallback stacks.

### 9.4 Motion sequence (public home page)
1. **Push intro (pinned, scroll-scrubbed).**
   - Starts as a full-screen `--ink` view with a small mono "scroll" hint.
   - As the visitor scrolls (about 100vh of pinned scroll), a `--paper` panel is pushed in from the left edge to the right, tied to scroll progress (scrubbed, not time-based), so it follows wheel or finger.
   - The name **"Ashwith"** (Doto) is revealed as the panel passes. Its colour settles from `--accent` to `--ink`, and optionally its weight shifts (variable font).
   - When the panel completes, a mono subtitle fades in (from `Profile.heroTagline`, e.g. `ai / mobile / data`), then the pin releases.
   - v1 uses a clean panel edge. An optional small original illustrated element on the edge can be added later.
2. **Selected work.** A pinned section where numbered project cards (01, 02, 03…) slide sideways as the visitor scrolls. Cards come from published projects ordered by `order`. Each shows a device-framed screenshot, title, and accent mono tags from `techStack`. Cards link to the case-study page.
3. **Pull quote.** One line from `Profile.pullQuote` on an `--ink` background; words reveal progressively on scroll.
4. **Skills.** Original SVG line-art (a neural-net node graph or phone wireframe) that draws itself on scroll via `stroke-dashoffset`. Skills grouped by category with mono labels. Add a small "currently building / learning" block from `Profile.currentlyBuilding`.
5. **Contact.** Full-bleed `--accent` section, large "Let's talk", underlined form fields, email address, honeypot field on the form.

### 9.5 Implementation rules
- Use GSAP + ScrollTrigger (pin, scrub) and Lenis. Register plugins inside client components only; dynamically import where possible.
- Create animations inside `gsap.context()` and clean up (kill triggers, revert) on unmount so App Router navigation does not leak or duplicate triggers.
- Animate only `transform`, `opacity`, and `clip-path`. Avoid animating layout properties.
- **Content must render server-side.** Animation is progressive enhancement: the page must be readable and indexable with JS disabled or slow.
- **Mobile (below 768px):** shorter pin distance; replace the pinned horizontal projects section with a vertical stack or native scroll-snap row; simplified intro.
- **`prefers-reduced-motion`:** no pinning or scrubbing; replace the intro with a simple fade; all content immediately visible.
- Intro must not delay LCP or block navigation. Provide a visible skip path (normal scrolling must always work; keyboard users can tab to content).
- Performance budget: LCP under 2.5s, CLS under 0.1, no long main-thread tasks from animation setup. Use `next/image` for all images.
- All visible text (name, tagline, pull quote, skills, projects) comes from the database and is editable in the admin panel.

### 9.6 Admin panel design
Clean and functional, no flashy motion, comfortable on a phone. Reuse the same tokens, fonts, and light/dark modes.

## 10. Phases (execute in order, one at a time)

After each phase: run lint + typecheck + build, summarize what changed, and **stop for review** before the next phase. Make small, logical git commits.

### Phase 0 — Scaffold
- `create-next-app` (TypeScript, Tailwind, App Router, `src/` dir, ESLint).
- Install: `mongoose bcryptjs jose zod cloudinary`.
- Add `.env.example`, `.gitignore` check, folder skeleton, design tokens.
- **Done when:** `npm run dev` and `npm run build` pass; empty home page renders.

### Phase 1 — Database layer
- `lib/db.ts` with a cached global connection (serverless-safe).
- All Mongoose models + zod validators.
- A `scripts/seed.ts` that inserts one Profile plus sample Projects, Skills, and Experience (placeholder content the owner will replace from the admin panel).
- **Done when:** seed runs against Atlas and documents appear in the database.

### Phase 2 — Auth
- `/api/auth/login` and `/logout`, `lib/auth.ts` with `requireAdmin()`, middleware/proxy protecting `/admin/*`, login page, login rate limit.
- A small script to generate `ADMIN_PASSWORD_HASH` from a password.
- **Done when:** logging in works, `/admin` is inaccessible without a session, and write APIs return 401 when unauthenticated.

### Phase 3 — Content APIs
- CRUD route handlers for profile, projects, skills, experience; messages POST/GET.
- zod validation, consistent JSON error shape, `revalidatePath` after every write.
- **Done when:** every endpoint works via curl/REST client with and without auth as expected.

### Phase 4 — Public portfolio and motion
Work through these sub-steps, stopping for review after each:
- **4a. Foundations:** design tokens (section 9.2), fonts via `next/font` (9.3), global layout, light and dark modes, base components.
- **4b. Static sections (no animation yet):** hero, selected work, skills, "currently building", pull quote, experience, contact form, `/projects` and `/projects/[slug]` case-study pages (render markdown, image gallery). Fully responsive and rendering from DB data.
- **4c. Push intro:** the scroll-scrubbed panel push and name reveal (section 9.4, item 1) with the reduced-motion fallback.
- **4d. Remaining motion:** pinned horizontal projects, pull-quote word reveal, skills line-art draw, contact section.
- **4e. Mobile and accessibility pass:** mobile fallbacks, `prefers-reduced-motion`, keyboard navigation, contrast checks.
- SEO: metadata, Open Graph, sitemap, robots, favicon. `notFound()` for unpublished or missing slugs.
- **Done when:** all pages render from DB data, the intro and animations behave per section 9, the site works with reduced motion and on mobile, and Lighthouse performance and accessibility scores are strong.

### Phase 5 — Admin panel
- Dashboard + forms for profile (including `heroTagline`, `pullQuote`, and `currentlyBuilding`), projects, skills, experience; messages inbox.
- Projects: create, edit, delete, publish/unpublish, feature toggle, drag-or-button reorder, markdown editor with preview, multi-image upload.
- Cloudinary signed direct upload (`/api/upload/sign`), image preview, resume PDF upload.
- Loading, error, and success states; confirm dialogs for deletes.
- **Done when:** the owner can change every piece of visible content from `/admin` and see it live on the public site without redeploying.

### Phase 6 — Hardening & polish
- Rate limits, honeypot, input-length limits, error boundaries, `loading.tsx`/skeletons, image optimization with `next/image` (configure Cloudinary remote pattern).
- Accessibility pass and responsive pass.
- Re-check the performance budget from section 9.5 on a throttled mobile profile (LCP, CLS, animation jank).
- **Done when:** no console errors, build is clean, security checklist in section 7 verified.

### Phase 7 — Deploy
- Push to GitHub, import into Vercel, set all env vars, set `NEXT_PUBLIC_SITE_URL`.
- Atlas Network Access allows Vercel (`0.0.0.0/0`), Cloudinary configured.
- Run the seed (or enter real content via admin), test login and edits in production, connect a custom domain if available.
- **Done when:** production site is live, admin edits appear on the live site, and nothing sensitive is exposed.

## 11. Working agreements for Claude Code

- Read this whole file first. Confirm the installed Next.js version and adjust conventions accordingly.
- Work **one phase at a time**; do not jump ahead. Stop after each phase for review.
- Prefer simple, readable code over clever abstractions. TypeScript strict mode, no `any` unless justified.
- Ask before adding any dependency not listed here, and before anything that could cost money or require a paid plan.
- Never hard-code secrets, never commit `.env` files, never print credentials in output.
- When something is ambiguous, ask a short question instead of guessing.
- Keep a short running `docs/PROGRESS.md` (phase status, decisions, open questions).

## 12. Owner's to-do before starting (manual steps)

1. Create a **MongoDB Atlas** free (M0) cluster and a database user; copy the connection string.
2. Create a **Cloudinary** free account; copy cloud name, API key, API secret.
3. Create a **GitHub** repo and a **Vercel** account linked to it.
4. Decide the admin email and password (password is only hashed locally, never stored in plain text).
5. Gather real content: bio, project descriptions and screenshots, skills list, resume PDF. (Placeholder content is fine at first. It can be replaced from the admin panel later.)

## 13. Definition of done

- [ ] Public site is live on Vercel, fast, responsive, and accessible.
- [ ] Scroll intro, pinned projects, pull quote, line-art, and contact section work per section 9, with mobile and reduced-motion fallbacks.
- [ ] Palette and fonts follow section 9.2 and 9.3; no copied assets from reference sites.
- [ ] `/admin` is protected; only the owner can log in and write.
- [ ] Every section (profile, projects, skills, experience, resume, images) is editable from the admin panel with changes visible live.
- [ ] No secrets in the repo; `.env.example` is present and accurate.
- [ ] README explains setup, env vars, seeding, and deployment.

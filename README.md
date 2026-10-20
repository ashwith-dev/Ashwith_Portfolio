# Ashwith Thatipally — Portfolio

Personal portfolio site with a browser-based admin CMS.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · MongoDB Atlas · GSAP + Lenis · Cloudinary · JWT auth

---

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd personal_portfolio
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in every value:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Generate: `openssl rand -base64 64` |
| `ADMIN_EMAIL` | Your email address |
| `ADMIN_PASSWORD_HASH` | See step 3 below |
| `CLOUDINARY_*` | Cloudinary dashboard → API Keys |
| `NEXT_PUBLIC_SITE_URL` | Your production domain |

### 3. Generate admin password hash

```bash
npx tsx scripts/hash-password.mts yourpassword
```

Copy the **Raw hash** line into `ADMIN_PASSWORD_HASH` in the Vercel dashboard (paste as-is). For a local `.env.local`, escape every `$` with `\$`.

### 4. Seed the database

```bash
npx tsx scripts/seed.mts
```

This inserts real content from the resume (projects, skills, experience, profile). Run once after setting `MONGODB_URI`.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public site  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — CMS

---

## Deploy to Vercel

1. Push to GitHub
2. Import project in [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in **Settings → Environment Variables**
4. MongoDB Atlas → **Network Access → Add IP Address → Allow from anywhere** (`0.0.0.0/0`)
5. Deploy — no build env vars needed; DB connects at runtime

---

## Admin panel

Visit `/admin/login` with your `ADMIN_EMAIL` and password.

From the admin panel you can:
- Edit your name, bio, tagline, hero tagline, pull quote, location, social links, and resume/avatar URLs
- Add / edit / delete / publish / feature / reorder projects
- Upload project images via Cloudinary (signed direct upload)
- Manage skill categories
- Add / edit / delete experience and education entries
- Read contact form messages

Every save triggers `revalidatePath`, so the public site updates instantly without a redeploy.

---

## Motion

- **Push intro**: scroll-scrubbed ink→paper panel reveal of the name in Doto font
- **Projects**: pinned horizontal scroll on desktop, vertical stack on mobile
- **Pull quote**: word-by-word opacity reveal on scroll
- **Skills**: SVG neural-net line-art draws itself on scroll
- All animations wrapped in `gsap.context()` with cleanup; `prefers-reduced-motion` skips all pinning

---

## Fonts

- **Doto** — hero name only
- **Geist** — headings and body
- **Geist Mono** — labels, tags, numbers

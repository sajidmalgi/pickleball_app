# RALLY.GG — Crew Scoreboard

A shared web app for tracking pickup games, match results, player stats, banter, venues, and post-game fuel. Built for a small group of friends. No install required — just a link.

---

## What's inside

| Section | What it does |
|---|---|
| **Scores** | Live leaderboard with W/L records, win %, and hot/cold streaks. Filterable by sport. |
| **Roster** | Player cards with bio, stats, and streak indicator. Click any card or avatar to open their full profile. |
| **Results** | Full match history. Log any sport, pick teams, enter score, add a note. |
| **Spots** | Venue directory — your regular courts with sport tags, star ratings, cost, and insider tips. |
| **Fuel** | High-protein post-game meals with full macro breakdown. |
| **Chat (Dispatch)** | Banter board. Post as yourself, react with 🔥 💀 🏆. |
| **Admin Panel** | Admins only — edit/delete matches, remove posts, manage the roster. |

---

## Deployment (GitHub Pages — free)

### One-time setup

**1. Set up JSONbin (shared database)**
- Go to jsonbin.io and create a free account
- Click Create Bin, paste this as the content:
  {"players":[],"matches":[],"banter":[],"venues":[]}
- Copy the Bin ID from the URL bar
- Go to API Keys in the sidebar → create a Master Key → copy it
- Open index.html in any text editor and find these two lines near the top:

  const BIN_ID  = 'YOUR_BIN_ID_HERE';
  const API_KEY = 'YOUR_API_KEY_HERE';

  Replace both values with your Bin ID and API Key.

**2. Set your admin PIN**
Still in index.html, find:
  const ADMIN_PIN = '0000';
Change 0000 to a 4-digit code only you and your co-admin know.

**3. Confirm admin names**
  const ADMIN_NAMES = ['Saj', 'Abby'];
These are the players with admin privileges. Must match the start of their roster name (case-insensitive). Update if needed.

**4. Deploy to GitHub Pages**
- Go to github.com → sign in or create a free account
- Click + → New repository → name it anything (e.g. rally) → set to Public → Create
- Click "uploading an existing file" → drag in index.html → Commit changes
- Go to Settings → Pages → Source: Deploy from a branch → Branch: main / / (root) → Save
- Wait ~60 seconds → your URL appears:
  https://YOUR-USERNAME.github.io/rally/

**5. Share the link**
Send it to your crew. That's it.

---

## First launch

On first load the app seeds with demo player data so it doesn't look empty. To start fresh:
1. Go to your JSONbin dashboard
2. Open your bin and replace the content with:
   {"players":[],"matches":[],"banter":[],"venues":[]}
3. Reload the app — it'll be blank and ready for your real roster

---

## How players join

1. Open the link on any phone or browser
2. Tap their name on the login screen
3. Set a 4-digit PIN (first time only)
4. They're in — stays logged in automatically after that

New players need to be added to the roster by an existing player or admin before they can log in.

---

## Admin access

Players named Saj or Abby (configurable via ADMIN_NAMES) automatically see the Admin panel. Admins can:

- Edit any match result — fix a wrong score; W/L records recalculate automatically
- Delete any match — removed from history, records recalculate
- Remove any banter post — with a confirmation step
- Remove a player — also removes their matches and posts

All destructive actions require a confirmation tap and cannot be undone.

---

## Profile photos

Players upload a photo from their profile page (Edit Profile → tap the photo zone).
Photos go to Imgur's free anonymous API — no account needed — and the URL is saved
to the shared database so everyone sees the photo on all devices immediately.

---

## Notifications

The app polls every 30 seconds. Toast notifications appear for:
- ⚡ A match was logged (shows teams and score)
- 💬 Someone posted to the dispatch
- Admin action confirmations
- ⚠️ Sync errors

---

## Sports supported

Badminton, Pickleball, Volleyball, Basketball, Tennis, Table Tennis

To add a sport: open index.html, find:
  const SPORTS = [...]
and add the sport name to the array.

---

## Free tier limits

  JSONbin       10,000 requests/month   (~1,000/day for 8 active players)
  Imgur         Generous anonymous cap  (one request per photo upload)
  GitHub Pages  Unlimited static host   (no limit concerns)

No credit card required for any of them.

---

## Updating the app

1. Edit index.html locally
2. Go to your GitHub repo
3. Click index.html → pencil icon → paste updated content → Commit changes
4. GitHub Pages redeploys in ~60 seconds

---

## File structure

  index.html   The entire app. One file, no build step, no dependencies.
  README.md    This file.

Everything — HTML, CSS, React, and all app logic — lives in index.html.
There is no separate app.js or stylesheet to manage.

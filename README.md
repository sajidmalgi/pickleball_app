# The Pickup Gazette — Deploy to GitHub Pages

## Free hosting on GitHub Pages (no Netlify needed)

### One-time setup

1. **Create a GitHub account** at https://github.com if you don't have one.

2. **Create a new repository:**
   - Go to https://github.com/new
   - Repository name: `pickup-gazette` (or anything you want)
   - Set it to **Public** (required for free GitHub Pages)
   - Click "Create repository"

3. **Upload your files:**
   - Click "uploading an existing file" link on the new repo page
   - Drag & drop `index.html` and `app.js`
   - Commit the files

4. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Under "Source", select **Deploy from a branch**
   - Branch: `main`, folder: `/ (root)`
   - Click Save
   - Wait ~1 minute, then your site is live at:
     `https://YOUR_USERNAME.github.io/pickup-gazette/`

### Share the link with your crew
Everyone opens the same URL. Since all data is stored in each browser's localStorage, each device maintains its own copy. 

### For shared data across devices (optional upgrade)
If you want everyone to see the same scores, consider:
- [JSONbin.io](https://jsonbin.io) — free API to store/sync JSON
- [Supabase](https://supabase.com) — free Postgres + REST API
- [Firebase Realtime Database](https://firebase.google.com) — free tier generous

The app is currently built so each key data function (`setMatches`, `setPlayers`, etc.) can be swapped from localStorage to any API with minimal changes.

---

## What's in the app

| Section | Features |
|---|---|
| **Front Page** | Live standings, recent results, current champion card, dispatch preview |
| **The Roster** | Player cards with W/L/streak, click to open full profile |
| **Match Results** | Log any sport, team builder, score entry, notes, full history table |
| **Profile Pages** | Per-player scorecard, bio, match history, edit bio/handle/photo URL |
| **Our Spots** | Venue directory with sport tags, ratings, cost, tips |
| **Post-Game Fuel** | High-protein meal cards with macros |
| **The Dispatch** | Banter board with fire/skull/trophy reactions |

## Sports supported (easily extensible)
Badminton, Pickleball, Volleyball, Basketball, Tennis, Table Tennis

To add a sport: find `const SPORTS` in `app.js` and add the sport name to the array.

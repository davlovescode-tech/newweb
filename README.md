# newweb

A long, loud, scroll-driven portfolio with a real-time 3D scene (hand-written WebGL, no libraries) that dances to a beat.

It walks through nine projects, one chapter each:

| # | Project | Type |
|---|---------|------|
| 1 | Roblox Scripts | script |
| 2 | My First Portfolio | website |
| 3 | Ultron (Discord bot) | bot |
| 4 | Friday (device control bot) | bot |
| 5 | J.A.R.V.I.S (call handling bot) | bot |
| 6 | Indian Brainrot | game |
| 7 | Hollowpoint | game |
| 8 | This Website | website |
| 9 | Coming Soon | teaser |

Around the chapters: hero, marquee bands, pinned manifesto, counters, hover-preview project index, a sideways-scrolling "what I build" gallery, a "how I got here" timeline, about and contact.

## Run it

It uses `fetch` and audio, which browsers block on `file://`, so run a tiny local server:

```bash
cd newweb
python3 -m http.server 8000
# open http://localhost:8000
```

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). There is no build step.

For GitHub Pages: repo **Settings → Pages → Deploy from a branch → `main` / root**.

## Add your images

Put the files in `assets/images/` with exactly these names. Until a file exists, the site shows its built-in artwork, so nothing looks broken while you add them.

| Project | File |
|---------|------|
| Roblox Scripts | `assets/images/roblox-scripts.jpg` |
| My First Portfolio | `assets/images/first-portfolio.jpg` |
| Ultron | `assets/images/ultron.jpg` |
| Friday | `assets/images/friday.jpg` |
| J.A.R.V.I.S | `assets/images/jarvis.jpg` |
| Indian Brainrot | `assets/images/indian-brainrot.jpg` |
| Hollowpoint | `assets/images/hollowpoint.jpg` |
| This Website | `assets/images/this-website.jpg` |
| Link preview (optional) | `assets/images/og.jpg`, then see the `og:image` TODO in `index.html` |

Tips: about 1600×1000 (16:10), under 400 KB each. Different file names or extensions (`.png`, `.webp`) are fine, just change `image:` for that project in `js/config.js`.

Want a looping clip instead of a still? Drop an `.mp4`/`.webm` in `assets/video/` and set `video: 'assets/video/ultron.mp4'` on the project. Extra screenshots go in `gallery: [...]` and crossfade inside the frame.

## Add your sound

1. Put your track at **`assets/audio/track.mp3`**.
2. Press **Sound** on the site. The 3D toys, the page flashes and the beat HUD now follow *your* track (kick, snare and hat are detected from the audio).
3. No file there? The site plays a built-in disco loop it synthesises itself, so the button always works.

Optional click, hover, whoosh and copy sounds: set the paths under `audio.sfx` in `js/config.js` (for example `assets/audio/click.mp3`). Left empty, small synthesised blips are used.

Browsers only allow sound after a click or tap, so the site starts silent and the Sound button turns it on.

## What to edit

Almost everything lives in **`js/config.js`**. Search for `TODO`.

- **Identity:** `first`, `last`, `initials`, `city`, `email`
- **Projects:** each has `title`, `year`, `status`, `short`, `desc`, `tags`, `links`, `image`, `theme`
- **Links:** `links: [{ label: 'Visit the site', href: 'https://...' }]` adds a button under the project description
- **Coming soon:** set `releaseAt: '2027-01-15T18:00:00+05:30'` for a live countdown
- **About, toolbox, "right now" list, socials:** further down the same file

Colours for the page and the 3D scene are in `js/themes.js`. Every project picks one with `theme`.

## Files

```
index.html        page skeleton and meta tags
styles.css        all styling
js/config.js      YOUR content, edit this
js/themes.js      colour themes
js/main.js        builds the page from config, scroll effects, interactions
js/stage.js       WebGL 3D scene (toys, physics, lighting)
js/audio.js       synth beat, your track, sound effects
assets/           images, audio, video
```

## Keyboard

`C` colours · `S` sound · `Home` top

Respects `prefers-reduced-motion`, and falls back to flat artwork if WebGL is unavailable.

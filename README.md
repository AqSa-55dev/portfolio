# Portfolio — Aqsa Basheer

Plain HTML/CSS/JS, no build step, deploys directly on GitHub Pages.

## Structure

```
index.html          → homepage (hero, projects, about, skills, experience, contact)
project.html         → reusable case-study template (reads ?slug= from the URL)
css/styles.css        → design tokens + all styles
js/projects-data.js   → single source of truth for every project
js/main.js            → nav, mobile menu, scroll reveal, renders project cards on the homepage
js/project-detail.js  → renders the case-study page from projects-data.js
projects/              → screenshot folders (currently placeholders — see below)
```

## Adding a new project

1. Add an object to the `PROJECTS` array in `js/projects-data.js`.
2. Drop images in `projects/<slug>/` (hero.png + any screenshots).
3. Update the `image` / `screenshots` paths in that project's object.
4. Done — no component or HTML changes needed. The card and case-study page render automatically.

## Screenshots

All six projects now have real screenshots wired in:

| Project | Source |
|---|---|
| IntervAI | Hotlinked from GitHub repo (3 screenshots) |
| TEYZIX Analytics Dashboard | Hotlinked from GitHub repo (preview + lighthouse) |
| Metric (SaaS_Dashboard) | Hotlinked from GitHub repo |
| Field Operations Manager | Local file: `projects/field-ops/dashboard.png` |
| TEYZIX Core Website Redesign | Local file: `projects/teyzix-redesign/home.jpg` |
| Mug & Mood | Local files: `projects/mug-and-mood/light-mode.png` + `dark-mode.png` |

The rendering logic in `js/main.js` and `js/project-detail.js` treats any truthy `image` value (local path or full URL) as real and renders it directly — no per-project code changes needed if you swap or add more screenshots later, just update the paths in `js/projects-data.js`.

## Known gaps to close before calling this done

- The `portfolio` repo itself (where this code should be committed) — confirmed public and live at aqsa-55dev.github.io/portfolio.
- Double-check the `og:image` / social preview meta tag in `index.html` once you've picked a hero screenshot for social sharing — currently unset.

# Charlene Teo — Portfolio

Static site (HTML/CSS/JS, no build step). Hosted on GitHub Pages.

- `index.html` — content (projects, experience, about, contact)
- `styles.css` — design tokens & layout (light/dark)
- `script.js` — filters, project modal, scroll reveals, theme toggle
- `assets/` — images and résumé

To add a project, copy an `<article class="card">` block in `index.html`; the hidden `.detail` div is what opens in the modal.

Preview locally: `python3 -m http.server` then open http://localhost:8000

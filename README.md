# Field Day Studios — Website

The one-page marketing site for [Field Day Studios](https://fielddaystudios.com), rebuilt as clean static HTML/CSS/JS from the v3 design handoff.

## Structure

```
index.html                        # All page markup (10 sections)
css/styles.css                    # Site styles (layout, components, responsive)
js/main.js                        # Nav, password gate, story toggles, contact form
assets/
  brand/colors_and_type.css       # Design tokens (colors, type, spacing, easing)
  brand/fonts/                    # Bundled brand fonts (@font-face in fonts.css)
  brand/assets/                   # Texture overlay
  uploads/                        # Illustrations, headshot
```

## Running locally

No build step. Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly via `file://` also works, though fonts and `fetch` behave more predictably over HTTP.)

## Notes

- **Contact form** posts to Formspree (`https://formspree.io/f/xaqgkqjw`) via `fetch`; the `action` attribute is set so the form still submits if JavaScript is disabled.
- **Stories section** is unpublished pending client approval. Its markup and JS are archived outside this repo; marker comments in `index.html` (nav + body) and `js/main.js` show where it re-inserts. Its styles remain in `css/styles.css`.
- **Fonts**: Bungee, Sora, Roboto Serif, and Playwrite GB J are bundled locally; Roboto Mono loads from Google Fonts (see `assets/brand/fonts/fonts.css`).
- **Booking link** ("Book a Call") and other external URLs are defined at the top of `js/main.js` and in the footer markup.

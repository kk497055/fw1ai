# Firstwave Solutions LLC

Company website at https://fw1ai.com. GitHub Pages deploys the root of `main`; `CNAME` preserves the domain.

## Creative direction: Signal into systems

A living, pointer-responsive toroidal wave, oversized typography, dark olive and warm ivory surfaces, acid-green accents and restrained orange details. Scroll reveals and an interactive lab connect the visual concept to practical software delivery.

The canvas sculpture is generated locally with the Canvas 2D API: no video downloads, animation packages or runtime dependencies. It pauses outside the hero and when the document is hidden. Reduced-motion preferences and an explicit pause control govern motion throughout the page. Scrolling remains native.

## Preview

Run `python3 -m http.server 8765` and open http://localhost:8765.

## Interactive lab

- Workflow: a timed, local sample document pipeline with replay.
- Interface: switch illustrative dashboard data between week and month.
- Intelligence: scripted answers sourced from the site's own approach copy.

All concepts are marked as illustrative, not client projects. No live AI request, document upload or external data call occurs in the demos. Tabs support arrow keys, Home and End. The mobile navigation keeps underlying content inert while open.

## Contact delivery

The inquiry form preserves the previous site's Formspree endpoint, `https://formspree.io/f/mwpqonzw`. Confirm account ownership, destination inbox and a real submission before relying on it for leads. Failed submissions retain the entered brief and show the direct email fallback, `info@fw1ai.com`.

## Verification

Checked desktop and mobile rendering, no horizontal overflow at 390px, mobile navigation, demo workflow completion/replay, dashboard changes, scripted answers, keyboard tabs and reduced-motion behavior. JavaScript syntax and static links/assets checked. Form inbox delivery has not been verified.

## Service and sector detail pages

The site includes three service pages and six sector pages (SaaS, professional services, ecommerce, nonprofits, healthcare and energy), plus the `/markets/` hub. Each page includes an illustrative scope, deliverables, indicative build window, inputs, scope boundaries, FAQs and an inquiry CTA. Healthcare and energy copy describes bounded administrative projects rather than clinical decisions or infrastructure control.

Content and the shared HTML template live in `scripts/build_detail_pages.py`. After editing them, run:

```
python3 scripts/build_detail_pages.py
```

This regenerates the ten detail pages and the sitemap. `details.css` and `details.js` supply the shared visual treatment, motion preferences, navigation and scroll reveals. Service and sector CTAs pass a validated project type and a length-limited interest label into the homepage inquiry form. No form is submitted automatically.

Verified all eleven pages at 390px and 1440px, local file links and anchors, FAQ expansion and the inquiry context handoff. No message was submitted to the external form service during verification.

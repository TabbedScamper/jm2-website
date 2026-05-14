# JM2 Engineering Website

## Project Overview
Website for JM2 Engineering - a mechanical/electrical engineering firm in Jackson, TN. Features GSAP animations, team carousel, service panels with skewed designs, and contact form.

## Live Site
- **GitHub Pages**: https://tabbedscamper.github.io/jm2-website/
- **Repository**: https://github.com/TabbedScamper/jm2-website

## Key Files
- `index.html` - Main HTML structure
- `css/style.css` - Primary styles
- `css/responsive.css` - Mobile/tablet breakpoints
- `css/animations.css` - Animation keyframes
- `js/main.js` - Carousel, filters, dynamic content loading
- `js/animations.js` - GSAP ScrollTrigger animations
- `js/service-detail.js` - Service overlay with embedded fallback data
- `js/navigation.js` - Mobile nav handling

## Recent Work (May 2026)

### Service Panels - Skewed Zigzag Design
- Alternating skewed blue backgrounds creating connected zigzag pattern
- Left panels: Blue on LEFT side with `skewX(15deg)`, text right-aligned
- Right panels: Blue on RIGHT side with `skewX(-15deg)`, text left-aligned
- Counter-skew on `.service-inner` to keep text straight (`skewX(-15deg)` / `skewX(15deg)`)
- 6px black borders for definition
- Panels connect with no gap (`margin-bottom: 0`)

### Mobile Fixes Applied
- Scroll indicator centering: Uses `left: 50%; transform: translateX(-50%)` with GSAP `xPercent: -50` to preserve centering during animation
- Team carousel height: Increased to `min-height: 800px` on mobile to fit tallest bio + 1.2x scale of center card
- Contact section: Added `z-index: 10` to stay above any overflow

### Opera GX Compatibility
- Embedded team members directly in HTML (fetch blocked on local files)
- Added `SERVICES_FALLBACK` data in `service-detail.js` for service overlay
- Font path fixed: `../assets/fonts/boldfinger.ttf`

### Other Completed Tasks
- Logo updated to upscaled version with drop shadows
- Hero tagline changed to "A Better Design" with full description
- Electrical engineering merged into main Engineering service
- Service detail overlay moved outside `<main>` to avoid GSAP blur effects

## Git Workflow
To push changes:
```bash
cd "C:\Users\mwalt\Dropbox\Personal-Files\websites\JM2"
git add -A
git commit -m "Description of changes"
git push
```
Site updates on GitHub Pages within 1-2 minutes after push.

## Pending/Known Issues
- Test scroll indicator centering on mobile after latest push
- Test team carousel height on mobile after latest push
- May need further adjustments based on testing

## Tech Stack
- HTML5, CSS3, JavaScript (ES6)
- GSAP 3.12.5 + ScrollTrigger
- GitHub Pages hosting
- Formspree for contact form (needs setup with actual form ID)

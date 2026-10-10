# Portfolio Development Plan

## Core Constraints & Guiding Principles
- **No AI-Generated Images:** Use only original photos, asset pointers, or authentic vector graphics.
- **Zero Emojis:** Strictly no emoji characters anywhere on the site; use clean SVGs or text symbols.
- **No Spider Imagery:** Strictly exclude spiders or spider-like graphics from stickers and effects.
- **No Dynamic 3D Tilt:** Polaroids remain static with tape and staple accents.
- **Banned Vocabulary:** Never use the terms "fandom" or "influence".
- **Authentic Badges Only:** Team, museum, and institutional logos must be authentic vectors or uploaded originals.
- **Privacy & Modesty:** Paavan's soccer action photo is cropped solo (#13 jersey); opponent is never shown.

---

## 1. Hero & About Section Polish

### Heading Gap Fix
- **Target:** `.original-about h1` in `src/styles.css`
- **Change:**
  - Reduce `min-height` from `2.2em` down to `1.15em` (`fit-content`).
  - Reduce `margin-bottom` from `24px` to `12px` (and `8px` on mobile breakpoints).
- **Outcome:** Eliminates the phantom empty block below "Paavan Randhawa!" so the name and "Student at Simon Fraser University" remain tightly and consistently paired across all viewport sizes, while `.typewriter-pending` keeps the greeting layout shift-free.

### About Section Bio
- **Replace:** `"I'm a computing science student in Vancouver, focused on building software that is useful and carefully made — from games and solvers to systems programming."`
- **With:** `"Hi, I'm Paavan! I'm a third-year Mathematics and Computing Science student at Simon Fraser University. I love solving problems, whether that's building software, working with data, or figuring out what makes a product great for the people using it."`

---

## 2. Contact Me Section

- **Subtitle Alignment:** Centered text.
- **Updated Text:** `"Have a question or just want to say hello? Send a note and I’ll get back to you."` (removes "a project idea" reference).

---

## 3. Interests Section: Curved Arc & Mobile Photo Stack

### The 11 Curated Items & Micro-Descriptions
1. **Lost Lake** (`lostlake.jpeg`)
   - Description: *Biking in Whistler*
   - Corner Badge: Authentic bicycle icon / stamp
2. **Vancouver Canucks** (`IMG_9425.jpeg`)
   - Description: *Canucks at Rogers Arena*
   - Corner Badge: Official Vancouver Canucks crest (authentic vector)
3. **FIFA World Cup** (`Screenshot_...8.37.50.png`)
   - Description: *FIFA World Cup Canada vs Switzerland*
   - Corner Badge: Official Canada Soccer crest (authentic vector)
4. **Soccer Action** (`Screenshot_...8.15.27.png`, solo #13)
   - Description: *Matchday on the pitch*
   - Corner Badge: Corner athletic tape strip
5. **Vancouver Sun Run** (`Screenshot_...8.04.33.png` + GPX telemetry)
   - Description: *Vancouver Sun Run 10K*
   - Corner Badge: Clean cutout of purple Lululemon Split Shift runners (no text labels)
6. **Tunnel Bluffs** (`tunnelbluffs.png`)
   - Description: *Hiking Tunnel Bluffs*
   - Corner Badge: Trail pin / topo contour stamp
7. **Degas: Little Dancer** (`Screenshot_...8.38.03.png`)
   - Description: *Degas' Little Dancer*
   - Corner Badge: The Met museum wordmark
8. **Monet: Water Lilies** (`Screenshot_...8.38.27.webp`)
   - Description: *Monet at The Met*
   - Corner Badge: The Met museum wordmark
9. **Milo the Dog** (*Awaiting upload*)
   - Description: *My dog, Milo!*
   - Corner Badge: Paw print / pet tag stamp
10. **Positano** (*Awaiting upload*)
    - Description: *Sunny days in Positano*
    - Corner Badge: Official Italy flag ribbon / stamp
11. **Wicked the Musical** (*Awaiting upload*)
    - Description: *Wicked @ the Gershwin Theatre!*
    - Corner Badge: Wicked playbill banner corner

### Desktop Arc Specifications
- Cards follow a parabolic curve with tangential tilt (-24deg to +24deg).
- Hovering smoothly scales the card to ~1.35x, straightens it to 0deg, brings it to `z-index: 30`, and reveals the Polaroid border, handwritten micro-description, and corner badge.

### Mobile Stack Specifications
- Tactile stacked Polaroid card deck / swipeable carousel.
- Active card front-and-center at full reading scale with description and badge visible.
- Previous/next cards peek behind at alternating angles (+-4deg).
- Navigable via touch swipe and clean SVG arrows.

---

## 4. Sun Run Telemetry & Map Registration
- Wrap the OpenStreetMap tile grid and the GPX route SVG in a shared, aspect-ratio-locked viewport container so the route stays aligned over Vancouver streets on both mobile and desktop.
- Pin the transparent Lululemon Split Shift shoe cutout along the map edge with no text tags.

---

## 5. Origami Contact Form Animation
- On successful Web3Forms submission, fold the contact card into an SVG paper airplane that glides off-screen.
- Show an in-place confirmation message.
- Instant, non-motion fade when `prefers-reduced-motion` is enabled.

---

## 6. Interactive Polish & Details
- Draggable stickers with pointer lift physics, drop shadows, and soft release.
- Strictly non-emoji SVG controls site-wide (including footer intro replay).
- Preserved 85ms/character typewriter greeting ("Hi I'm Paavan Randhawa!") after the 8.5s intro completes.


# Portfolio Development Plan

## Core Constraints & Guiding Principles
- **No AI-Generated Images:** Use only original photos, asset pointers, or authentic vector graphics.
- **Zero Emojis:** Strictly no emoji characters anywhere on the site; use clean SVGs or text symbols.
- **No Spider Imagery:** Strictly exclude spiders or spider-like graphics from stickers and effects.
- **No Dynamic 3D Tilt:** Polaroids remain static with tape and staple accents.
- **Banned Vocabulary:** Never use the terms "fandom" or "influence".
- **Authentic Badges Only:** Team, museum, and institutional logos must be authentic vectors or uploaded originals.
- **Privacy & Modesty:** Paavan's soccer action photo is cropped solo (#13 jersey); opponent is never shown.
- **Descriptive Asset Naming:** All uploaded media will be committed with clean, semantic filenames in the repository.

---

## 1. Hero & About Section Polish

### Heading Gap Fix
- **Target:** `.original-about h1` in `src/styles.css`
- **Change:**
  - Reduce `min-height` from `2.2em` down to `1.15em` (`fit-content`).
  - Reduce `margin-bottom` from `24px` to `12px` (and `8px` on mobile breakpoints).
- **Outcome:** Eliminates the phantom gap below "Paavan Randhawa!" so the name and "Student at Simon Fraser University" remain tightly and consistently paired across all screen sizes, while `.typewriter-pending` keeps the greeting layout shift-free.

### About Section Bio
- **Replace:** `"I'm a computing science student in Vancouver, focused on building software that is useful and carefully made — from games and solvers to systems programming."`
- **With:** `"Hi, I'm Paavan! I'm a third-year Mathematics and Computing Science student at Simon Fraser University. I love solving problems, whether that's building software, working with data, or figuring out what makes a product great for the people using it."`

---

## 2. Contact Me Section

### Layout & Direct Email
- **Prominent Clickable Email:** Display `paavan_randhawa@sfu.ca` as a prominent, styled `mailto:paavan_randhawa@sfu.ca` link directly above the form with a copy button or link arrow for quick reach-out.
- **Subtitle Alignment:** Centered text.
- **Updated Subtitle Text:** `"Have a question or just want to say hello? Send a note and I’ll get back to you."` (removes the "project idea" phrase).
- **Web3Forms Integration:** Preserved backend key (`1725c347-0370-4255-8441-e8334e976b59`) with anti-bot protection.

---

## 3. GitHub Image Assets & Filename Mapping

Original images are registered in `src/assets/interests/` as descriptive `.asset.json` pointers. The pointers sync to GitHub; full-resolution originals are served from Lovable Assets and are reusable through `src/lib/interests-assets.ts`. No Interests layout changes are included in this asset-registration step.

| Feature / Subject | Source Upload | Semantic Repository Filename |
| :--- | :--- | :--- |
| **Milo the Dog** | `IMG_3584.jpeg` | `paavan-milo-dog.jpg` |
| **Positano Coastline** | `IMG_1247.jpeg` | `paavan-positano-coast.jpg` |
| **Wicked at Gershwin** | `IMG_4078.jpeg` | `paavan-wicked-gershwin-theatre.jpg` |
| **Wicked Playbill Badge** | `wicked-playbill.jpg` (replacement upload) | `badge-wicked-playbill.jpg` |
| **Canucks Faceoff** | `IMG_9425.jpeg` | `paavan-canucks-rogers-arena.jpg` |
| **Vancouver Whitecaps** | `IMG_8859.jpeg` | `paavan-whitecaps-bc-place.jpg` |
| **FIFA World Cup** | `Screenshot_...8.37.50.png` | `paavan-world-cup-canada-switzerland.png` |
| **Soccer Matchday Solo** | `Screenshot_...8.15.27.png` | `paavan-soccer-matchday-solo-13.png` |
| **Degas' Little Dancer** | `Screenshot_...8.38.03.png` | `art-degas-little-dancer.png` |
| **Monet's Water Lilies** | `Screenshot_...8.38.27.webp` | `art-monet-water-lilies.webp` |
| **Sun Run Split Shifts source** | `Screenshot_...8.04.33.png` | `lululemon-split-shift-shoes-reference.png` (cutout still pending) |

---

## 4. Interests Section: Curved Arc & Mobile Photo Stack

### The 11 Curated Items & Micro-Descriptions
1. **Lost Lake** (`lostlake.jpeg`) — *Biking in Whistler* (Bicycle badge)
2. **Vancouver Canucks** (`paavan-canucks-rogers-arena.jpg`) — *Canucks at Rogers Arena* (Canucks crest)
3. **FIFA World Cup** (`paavan-world-cup-canada-switzerland.png`) — *FIFA World Cup Canada vs Switzerland* (Canada Soccer crest)
4. **Soccer Action** (`paavan-soccer-matchday-solo-13.png`) — *Matchday on the pitch* (Athletic tape)
5. **Vancouver Sun Run** (`gear-lululemon-split-shift-cutout.png` + GPX) — *Vancouver Sun Run 10K* (Split Shift shoe cutout)
6. **Tunnel Bluffs** (`tunnelbluffs.png`) — *Hiking Tunnel Bluffs* (Trail pin)
7. **Degas: Little Dancer** (`art-degas-little-dancer.png`) — *Degas' Little Dancer* (The Met wordmark)
8. **Monet: Water Lilies** (`art-monet-water-lilies.webp`) — *Monet at The Met* (The Met wordmark)
9. **Milo the Dog** (`paavan-milo-dog.jpg`) — *My dog, Milo!* (Pet tag stamp)
10. **Positano** (`paavan-positano-coast.jpg`) — *Sunny days in Positano* (Italy flag ribbon)
11. **Wicked the Musical** (`paavan-wicked-gershwin-theatre.jpg`) — *Wicked @ the Gershwin Theatre!* (`badge-wicked-playbill.jpg`)

### Desktop Arc Specifications
- Cards follow a parabolic curve with tangential tilt (-24° to +24°).
- Hover smoothly scales the card to ~1.35x, straightens to 0°, brings it to `z-index: 30`, and reveals the Polaroid border, handwritten micro-description, and corner badge.

### Mobile Stack Specifications
- Tactile stacked Polaroid card deck / swipeable carousel.
- Active card front-and-center at full reading scale with description and badge visible.
- Previous/next cards peek behind at alternating angles (±4°).
- Navigable via touch swipe and clean SVG arrows.

---

## 5. Sun Run Telemetry & Map Registration
- Lock OpenStreetMap tile grid and GPX route SVG into a shared, responsive viewport container so the route stays aligned over Vancouver streets on both mobile and desktop.
- Pin the transparent Lululemon Split Shift shoe cutout along the map edge with no text tags.

---

## 6. Origami Contact Form Animation
- On successful Web3Forms submission, fold the contact card into an SVG paper airplane that glides off-screen.
- Show an in-place confirmation message.
- Instant, non-motion fade when `prefers-reduced-motion` is enabled.

---

## 7. Interactive Polish & Details
- Draggable stickers with pointer lift physics, drop shadows, and soft release.
- Strictly non-emoji SVG controls site-wide (including footer intro replay).
- Preserved 85ms/character typewriter greeting ("Hi I'm Paavan Randhawa!") after the 8.5s intro completes.

# Archived: cinematic intro

Removed from the live site; kept here in case it comes back. Nothing in `src/` imports it.

- `cinematic-intro.tsx` — `<CinematicIntro onDone />`, 8.5s deterministic scene timers, skip via Escape/click.
- `intro.css` — all `.intro*` / `.replay-intro` styles and keyframes (was in `src/styles.css`).
- `cinematic-intro.test.tsx` — its Vitest tests.

## Restoring
1. Move `cinematic-intro.tsx` to `src/components/` and the test to `src/test/` (fix its import to `@/components/cinematic-intro`); append `intro.css` to `src/styles.css`.
2. In `src/routes/index.tsx` add `intro` state (`"pending" | "playing" | "done"`), set to `"done"` when `prefers-reduced-motion`, else `"playing"`.
3. Render `<CinematicIntro onDone={() => setIntro("done")} />` while playing (and `<div className="intro" aria-hidden />` while pending).
4. Lock `document.documentElement.style.overflow` to `"hidden"` until done, and only start the typewriter once `intro === "done"`.
5. Optional: footer "Replay Intro" button (`className="replay-intro"`) that sets `intro` to `"playing"`.

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Boot, then one word per beat; each glitch flash swaps palette and font.
const SCENES = [
  { name: "boot", at: 0 },
  { name: "w1", at: 2000 },
  { name: "g1", at: 3300 },
  { name: "w2", at: 3800 },
  { name: "g2", at: 5100 },
  { name: "w3", at: 5600 },
  { name: "exit", at: 7900 },
] as const;
const TOTAL = 8500;
const BOOT_LINES = ["SYSTEM_INIT ............ OK", "ALLOCATING_HEAP ........ OK", "MOUNTING PORTFOLIO.SYS . OK", "LOADING DIMENSIONS ..... OK"];
const WORDS = ["WELCOME", "to my", "PORTFOLIO"];
// Original pixel CS stickers (24x24 grid): floppy, terminal, CPU, braces.
const STICKERS = [
  <><path fill="var(--secondary)" d="M2 2h17l3 3v17H2z" /><path fill="var(--intro-ink)" d="M6 2h10v7H6zM5 13h14v9H5z" /><path fill="var(--secondary)" d="M13 3h2v5h-2z" /></>,
  <><path fill="var(--intro-ink)" d="M1 3h22v18H1z" /><path fill="var(--secondary)" d="M1 3h22v3H1zM4 9h2v2h2v2H6v2H4v-2h2v-2H4zM10 15h6v2h-6z" /></>,
  <><path fill="var(--secondary)" d="M7 1h2v4H7zM11 1h2v4h-2zM15 1h2v4h-2zM7 19h2v4H7zM11 19h2v4h-2zM15 19h2v4h-2zM1 7h4v2H1zM1 11h4v2H1zM1 15h4v2H1zM19 7h4v2h-4zM19 11h4v2h-4zM19 15h4v2h-4z" /><path fill="var(--intro-ink)" d="M5 5h14v14H5z" /><path fill="var(--secondary)" d="M9 9h6v6H9z" /></>,
  <><path fill="var(--intro-paper)" d="M7 2h4v3H8v5H5v4h3v5h3v3H7v-3H5v-5H2v-4h3V5h2zM13 2h4v3h2v5h3v4h-3v5h-2v3h-4v-3h3v-5h3v-4h-3V5h-3z" /></>,
];

export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [scene, setScene] = useState<string>("boot");
  const [time, setTime] = useState(0);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { onDone(); return; }
    const previousFocus = document.activeElement;
    skipRef.current?.focus({ preventScroll: true });
    const timers = SCENES.map(s => window.setTimeout(() => setScene(s.name), s.at));
    timers.push(window.setTimeout(onDone, TOTAL));
    const start = performance.now();
    const tick = window.setInterval(() => setTime(performance.now() - start), 83);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onDone(); };
    window.addEventListener("keydown", onKey);
    return () => {
      timers.forEach(clearTimeout); clearInterval(tick); window.removeEventListener("keydown", onKey);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onDone]);

  const frames = Math.floor(time / 1000 * 24);
  const tc = `00:00:${String(Math.floor(frames / 24)).padStart(2, "0")}:${String(frames % 24).padStart(2, "0")}`;
  const loaded = Math.min(10, Math.floor(time / 180));
  const lines = Math.min(BOOT_LINES.length, Math.floor(time / 420) + 1);

  return (
    <div className="intro sv" data-scene={scene} role="dialog" aria-modal="true" aria-label="Welcome to my portfolio">
      <svg className="intro-grain" aria-hidden="true" width="100%" height="100%"><filter id="intro-noise"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#intro-noise)" /></svg>
      <div className="intro-scanlines" aria-hidden="true" />
      <div className="sv-halftone" aria-hidden="true" />
      <p className="intro-tc" aria-hidden="true">{tc}</p>
      <span className="intro-edition" aria-hidden="true">PR / 001</span>
      <div className="sv-stage" aria-hidden="true">
        <div className="sv-boot">
          {BOOT_LINES.slice(0, lines).map(l => <span key={l}>&gt; {l}</span>)}
          <span className="sv-bar">{Array.from({ length: 10 }, (_, i) => <i key={i} data-on={i < loaded} />)}</span>
        </div>
        <div className="sv-stickers">{STICKERS.map((art, i) => <svg key={i} viewBox="0 0 24 24" shapeRendering="crispEdges">{art}</svg>)}</div>
        {WORDS.map((w, i) => (
          <span key={w} className={`sv-word sv-w${i + 1}`}>
            <span className="sv-layered"><span className="sv-ch sv-ch-c">{w}</span><span className="sv-ch sv-ch-m">{w}</span><span className="sv-ch sv-ch-k">{w}</span></span>
          </span>
        ))}
      </div>
      <div className="sv-flash" aria-hidden="true" />
      <Button ref={skipRef} type="button" variant="ghost" className="intro-skip" onClick={onDone} aria-label="Skip intro">SKIP INTRO <span aria-hidden="true">↗</span></Button>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Spider-Verse-style studio-logo glitch: boot -> glitch -> storm -> collapse -> name -> exit.
const SCENES = [
  { name: "boot", at: 0 },
  { name: "glitch", at: 2000 },
  { name: "storm", at: 3300 },
  { name: "collapse", at: 5400 },
  { name: "name", at: 6000 },
  { name: "exit", at: 7900 },
] as const;
const TOTAL = 8500;
const BOOT_LINES = ["SYSTEM_INIT ............ OK", "ALLOCATING_HEAP ........ OK", "MOUNTING PORTFOLIO.SYS . OK", "LOADING DIMENSIONS ..... OK"];
const WORDS = ["WELCOME", "TO MY", "PORTFOLIO"];

function Layered({ text, className }: { text: string; className: string }) {
  return (
    <span className={`sv-layered ${className}`}>
      <span className="sv-ch sv-ch-c">{text}</span>
      <span className="sv-ch sv-ch-m">{text}</span>
      <span className="sv-ch sv-ch-k">{text}</span>
    </span>
  );
}

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
    <div className="intro sv" data-scene={scene} role="dialog" aria-modal="true" aria-label="Welcome to my portfolio — Paavan Randhawa">
      <svg className="intro-grain" aria-hidden="true" width="100%" height="100%"><filter id="intro-noise"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#intro-noise)" /></svg>
      <div className="intro-scanlines" aria-hidden="true" />
      <div className="sv-halftone" aria-hidden="true" />
      <div className="sv-flash" aria-hidden="true" />
      <p className="intro-tc" aria-hidden="true">{tc}</p>
      <span className="intro-edition" aria-hidden="true">PR / 001</span>
      <div className="sv-stage" aria-hidden="true">
        <div className="sv-boot">
          {BOOT_LINES.slice(0, lines).map(l => <span key={l}>&gt; {l}</span>)}
          <span className="sv-bar">{Array.from({ length: 10 }, (_, i) => <i key={i} data-on={i < loaded} />)}</span>
        </div>
        <div className="sv-slices">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="sv-slice" style={{ ["--i" as string]: i }}>
              <div className="sv-words">{WORDS.map(w => <Layered key={w} text={w} className={w === "TO MY" ? "sv-small" : "sv-big"} />)}</div>
            </div>
          ))}
        </div>
        <div className="sv-name"><Layered text="PAAVAN" className="sv-big" /><Layered text="RANDHAWA" className="sv-big" /></div>
      </div>
      <Button ref={skipRef} type="button" variant="ghost" className="intro-skip" onClick={onDone} aria-label="Skip intro">SKIP INTRO <span aria-hidden="true">↗</span></Button>
    </div>
  );
}

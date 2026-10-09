import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const SCENES = [
  { name: "signal", at: 0 },
  { name: "impact", at: 1100 },
  { name: "paint", at: 2300 },
  { name: "fracture", at: 3500 },
  { name: "pixel", at: 4600 },
  { name: "collage", at: 5600 },
  { name: "freeze", at: 6750 },
  { name: "resolve", at: 7050 },
  { name: "exit", at: 7900 },
] as const;
const TOTAL = 8500;

const SPLASH = "M0-70C9-52 8-24 21-22L57-54 34-13 77-7 38 8 61 46 24 28 17 79 2 34-27 59-21 23-70 31-34 5-74-20-28-17-48-58-10-31Z";
const CRACK = "M670 340L535 273 467 164 379 137 309 32M535 273L407 293 335 238 230 247 85 160M407 293L361 414 269 457 193 617 74 710M670 340L783 248 801 136 956 51M783 248L905 290 1013 239 1200 265M670 340L766 454 897 474 974 598 1155 677M766 454L716 579 735 760M670 340L562 441 565 532 455 697M467 164L515 57M974 598L1118 533M335 238L307 152M897 474L1015 432";

export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [scene, setScene] = useState<string>("signal");
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

  return (
    <div className="intro" data-scene={scene} role="dialog" aria-modal="true" aria-label="Welcome to my portfolio — Paavan Randhawa">
      <svg className="intro-grain" aria-hidden="true" width="100%" height="100%"><filter id="intro-noise"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#intro-noise)" /></svg>
      <div className="intro-scanlines" aria-hidden="true" />
      <div className="intro-tears" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span key={i} />)}</div>
      <div className="intro-marks" aria-hidden="true"><span>+</span><span>+</span><span>+</span><span>+</span></div>
      <p className="intro-tc" aria-hidden="true">{tc}</p>
      <span className="intro-edition" aria-hidden="true">PR / 001</span>
      <div className="intro-stage" aria-hidden="true">
        <div className="intro-ghost intro-ghost-a">WELCOME</div>
        <div className="intro-ghost intro-ghost-b">PORTFOLIO</div>
        <div className="intro-welcome"><span className="intro-title">WELCOME</span><span className="intro-script">to my</span><span className="intro-title intro-title-bottom">PORTFOLIO</span></div>
        <svg className="intro-paint" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <g className="intro-splash intro-splash-a" transform="translate(195 195) scale(2.1)"><path d={SPLASH} /><circle cx="-66" cy="-55" r="5" /><circle cx="75" cy="37" r="7" /><circle cx="-35" cy="81" r="4" /></g>
          <g className="intro-splash intro-splash-b" transform="translate(1040 590) rotate(30) scale(2.7)"><path d={SPLASH} /><circle cx="-84" cy="20" r="4" /><circle cx="62" cy="-61" r="5" /></g>
          <g className="intro-drips"><path d="M0 0H1200V45Q1130 10 1080 50V164Q1069 183 1058 164V53L992 35V112Q982 136 972 112V42L146 36V212Q134 238 122 212V32L73 53V137Q64 156 55 137V35L0 62Z" /></g>
          <path className="intro-scribble" d="M60 670Q280 200 500 375T1090 140M130 730Q320 550 600 660T1150 360" />
        </svg>
        <svg className="intro-cracks" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><path d={CRACK} /><path className="intro-crack-offset" d={CRACK} /></svg>
        <div className="intro-floating">{["WELCOME", "to my", "PORTFOLIO", "WELCOME", "PORTFOLIO", "to my"].map((word, i) => <span key={i}>{word}</span>)}</div>
        <svg className="intro-ink" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path d="M168 460C50 90 1130 77 1050 440S20 777 160 455M760 680L1060 579 994 572M1060 579L1029 630" />
        </svg>
        <div className="intro-name"><span>Paavan</span><span>Randhawa</span></div>
      </div>
      <Button ref={skipRef} type="button" variant="ghost" className="intro-skip" onClick={onDone} aria-label="Skip intro">SKIP INTRO <span aria-hidden="true">↗</span></Button>
    </div>
  );
}

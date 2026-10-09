import { useEffect, useState } from "react";

const SCENES = [
  { name: "signal", at: 0 },
  { name: "impact", at: 1500 },
  { name: "zine", at: 3000 },
  { name: "halftone", at: 3875 },
  { name: "ink", at: 4750 },
  { name: "pixel", at: 5625 },
  { name: "collage", at: 6500 },
  { name: "freeze", at: 7500 },
  { name: "resolve", at: 7800 },
  { name: "exit", at: 8200 },
] as const;
const TOTAL = 8500;
export const INTRO_KEY = "intro-played";

export function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [scene, setScene] = useState<string>("signal");
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timers = SCENES.map(s => window.setTimeout(() => setScene(s.name), s.at));
    timers.push(window.setTimeout(onDone, TOTAL));
    const start = performance.now();
    const tick = window.setInterval(() => setTime(performance.now() - start), 83);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onDone(); };
    window.addEventListener("keydown", onKey);
    return () => { timers.forEach(clearTimeout); clearInterval(tick); window.removeEventListener("keydown", onKey); };
  }, [onDone]);

  const frames = Math.floor(time / 1000 * 24);
  const tc = `00:00:${String(Math.floor(frames / 24)).padStart(2, "0")}:${String(frames % 24).padStart(2, "0")}`;

  return (
    <div className="intro" data-scene={scene} role="dialog" aria-label="Intro animation">
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-marks" aria-hidden="true"><span>+</span><span>+</span><span>+</span><span>+</span></div>
      <p className="intro-tc" aria-hidden="true">{tc}</p>
      <div className="intro-stage" aria-hidden="true">
        <span className="intro-word intro-c">PAAVAN</span>
        <span className="intro-word intro-r">PAAVAN</span>
        <span className="intro-word intro-main">PAAVAN</span>
        <svg className="intro-ink" viewBox="0 0 400 200" preserveAspectRatio="none">
          <ellipse cx="200" cy="100" rx="180" ry="80" />
          <path d="M20 180 L120 140 M110 132 L122 140 L108 148" />
        </svg>
        <div className="intro-collage"><span>PA</span><span>AV</span><span>AN</span><span>PAAV</span></div>
      </div>
      <button type="button" className="intro-skip" onClick={onDone}>[ SKIP INTRO ↵ ]</button>
    </div>
  );
}

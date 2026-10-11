import { useState, useRef } from "react";
import { sunRun } from "@/lib/sun-run";

type PhotoCard = { type?: "photo"; url: string; alt: string };
type MapCard = { type: "map" };
type Card = PhotoCard | MapCard;

const cards: Card[] = [
  { url: "/images/whistler_lost_lake.jpeg", alt: "Biking in Whistler" },
  { url: "/images/interests/canucks.png", alt: "Canucks at Rogers Arena" },
  { url: "/images/interests/canada-switzerland.png", alt: "FIFA World Cup Canada vs Switzerland" },
  { url: "/images/interests/paavan-matchday.png", alt: "Matchday on the pitch" },
  { type: "map" },
  { url: "/images/tunnelbluffs.png", alt: "Hiking Tunnel Bluffs" },
  { url: "/images/interests/degas-ballerina.png", alt: "Degas' Little Dancer at The Met" },
  { url: "/images/interests/monet.png", alt: "Monet Water Lilies at The Met" },
  { url: "/images/interests/milo.png", alt: "Milo the dog" },
  { url: "/images/interests/positano.png", alt: "Sunny days in Positano" },
  { url: "/images/interests/wicked-gershwin-theatre.jpg", alt: "Wicked at the Gershwin Theatre" },
];

const stackTransforms = [
  "rotate(-2deg)",
  "translate(10px, 8px) rotate(5deg)",
  "translate(-8px, 14px) rotate(-3deg)",
];

function SunRunMap() {
  const scale = 316 / sunRun.w;
  return (
    <div className="polaroid-map-wrap">
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: sunRun.w, height: sunRun.h, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {sunRun.tiles.map(t => (
            <img key={`${t.x}-${t.y}`} src={`https://tile.openstreetmap.org/${sunRun.zoom}/${t.x}/${t.y}.png`} alt="" loading="lazy" style={{ position: "absolute", left: t.left, top: t.top, width: 256, height: 256 }} />
          ))}
        </div>
        <svg viewBox={`0 0 ${sunRun.w} ${sunRun.h}`} className="run-route" aria-label="Sun Run route" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d={sunRun.route} />
        </svg>
      </div>
      <small style={{ position: "absolute", bottom: 2, right: 4, fontSize: 9, color: "#555" }}>© OpenStreetMap</small>
    </div>
  );
}

export function InterestsArc() {
  const [active, setActive] = useState(0);
  const [grabbing, setGrabbing] = useState(false);
  const dragStart = useRef<number | null>(null);
  const n = cards.length;

  const next = () => setActive(i => (i + 1) % n);
  const prev = () => setActive(i => (i - 1 + n) % n);

  const handleTouchStart = (e: React.TouchEvent) => { dragStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    dragStart.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => { dragStart.current = e.clientX; setGrabbing(true); };
  const handleMouseMove = () => {};
  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    dragStart.current = null;
    setGrabbing(false);
  };
  const handleMouseLeave = () => { dragStart.current = null; setGrabbing(false); };

  return (
    <div className="polaroid-stack-wrap">
      <div
        className="polaroid-stack"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: grabbing ? "grabbing" : "grab" }}
      >
        {[2, 1, 0].map(offset => {
          const card = cards[(active + offset) % n];
          return (
            <div key={offset} className="polaroid-card" style={{ transform: stackTransforms[offset], zIndex: 10 - offset }}>
              {card.type === "map"
                ? <SunRunMap />
                : <img src={(card as PhotoCard).url} alt={(card as PhotoCard).alt} loading="lazy" draggable={false} />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

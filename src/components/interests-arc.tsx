import { useState, useRef, useEffect } from "react";

type BadgeOverlay = { kind: "badge"; url: string; style: React.CSSProperties };
type TextOverlay  = { kind: "text";  text: string; style: React.CSSProperties };
type Overlay = BadgeOverlay | TextOverlay;
type Card = { url: string; alt: string; caption: string; overlays?: Overlay[] };

const S = "/stickers/";
const I = "/images/interests/";

const R = (deg: number): React.CSSProperties => ({ transform: `rotate(${deg}deg)` });

const cards: Card[] = [
  { url: "/images/whistler.jpeg",       alt: "Whistler, BC",                   caption: "whistler" },
  { url: "/images/whistler_lost_lake.jpeg", alt: "Biking in Whistler",         caption: "biking in whistler" },
  {
    url: `${I}canucks.png`,             alt: "Canucks at Rogers Arena",         caption: "canucks at rogers arena",
    overlays: [
      { kind: "badge", url: `${S}canucks.png`,        style: { bottom: 66, left: 8,  width: 54, ...R(-20) } },
      { kind: "badge", url: `${S}canucks-jersey.png`, style: { top: 10,   right: 6,  width: 84, ...R(20)  } },
    ],
  },
  {
    url: `${I}canada-switzerland.png`,  alt: "FIFA World Cup Canada vs Switzerland", caption: "canada vs. switzerland @ the world cup",
    overlays: [
      { kind: "badge", url: `${S}canadasoccer.png`, style: { top: 10,   left: 8,  width: 54, ...R(-20) } },
      { kind: "badge", url: `${S}trionda.png`,      style: { bottom: 8, right: 8, width: 54, ...R(20)  } },
    ],
  },
  {
    url: `${I}paavan-matchday.png`,     alt: "Matchday on the pitch",           caption: "matchday",
    overlays: [
      { kind: "badge", url: `${S}barcelona.png`, style: { bottom: -10, right: 8, width: 58, ...R(20) } },
      { kind: "text",  text: "my favorite team is FC Barcelona!", style: { bottom: 2, right: 62 } },
    ],
  },
  {
    url: `${I}whitecaps.png`,           alt: "Vancouver Whitecaps at BC Place", caption: "whitecaps @ BC place",
    overlays: [
      { kind: "badge", url: `${S}whitecaps.png`, style: { bottom: 66, right: 8, width: 60, ...R(20) } },
    ],
  },
  {
    url: "/images/tunnelbluffs.png",    alt: "Hiking Tunnel Bluffs",            caption: "tunnel bluffs hike",
    overlays: [
      { kind: "badge", url: `${S}hike.png`, style: { bottom: 66, left: 8, width: 58, ...R(-20) } },
    ],
  },
  {
    url: `${I}degas-ballerina.png`,     alt: "Degas' Little Dancer at The Met", caption: "degas @ the met",
    overlays: [
      { kind: "badge", url: `${S}themet.png`,   style: { bottom: 66, left: 8,  width: 52, ...R(-20) } },
    ],
  },
  { url: `${I}monet.png`, alt: "Monet Water Lilies at The Met", caption: "monet @ the met" },
  { url: `${I}milo.png`,               alt: "Milo the dog",                    caption: "my dog, milo!" },
  { url: `${I}positano.png`,           alt: "Sunny days in Positano",          caption: "positano, italy" },
  {
    url: `${I}wicked-gershwin-theatre.jpg`, alt: "Wicked at the Gershwin Theatre", caption: "wicked on broadway",
    overlays: [
      { kind: "badge", url: `${S}wicked-hat.png`,               style: { top: -10, left: -8, width: 72, ...R(-20) } },
      { kind: "badge", url: `${I}wicked-playbill-sticker.jpeg`, style: { bottom: 22, right: 4, width: 68, ...R(20) } },
    ],
  },
];

const REST: [string, string, string] = [
  "rotate(-2deg)",
  "translate(10px, 8px) rotate(5deg)",
  "translate(-8px, 14px) rotate(-3deg)",
];
const THRESHOLD = 8;
const ANIM_MS = 260;

export function InterestsArc() {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [departing, setDeparting] = useState<"left" | "right" | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const dragRef = useRef<number | null>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const n = cards.length;

  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    const handler = (e: TouchEvent) => { if (dragRef.current !== null) e.preventDefault(); };
    el.addEventListener("touchmove", handler, { passive: false });
    return () => el.removeEventListener("touchmove", handler);
  }, []);

  useEffect(() => {
    if (!grabbing) return;
    const onMove = (e: MouseEvent) => {
      if (dragRef.current !== null)
        setDragX(Math.max(-90, Math.min(90, e.clientX - dragRef.current)));
    };
    const onUp = (e: MouseEvent) => {
      if (dragRef.current === null) return;
      const diff = dragRef.current - e.clientX;
      if (Math.abs(diff) > THRESHOLD) triggerDepart(diff > 0 ? "left" : "right");
      else setDragX(0);
      dragRef.current = null;
      setGrabbing(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [grabbing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (animRef.current) clearTimeout(animRef.current); }, []);

  const triggerDepart = (dir: "left" | "right") => {
    setDeparting(dir);
    animRef.current = setTimeout(() => {
      setActive(i => dir === "left" ? (i + 1) % n : (i - 1 + n) % n);
      setDeparting(null);
      setDragX(0);
    }, ANIM_MS);
  };

  const startDrag = (x: number) => { if (!departing) { dragRef.current = x; setGrabbing(true); } };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragRef.current !== null && !departing)
      setDragX(Math.max(-90, Math.min(90, e.touches[0].clientX - dragRef.current)));
  };
  const endTouchDrag = (e: React.TouchEvent) => {
    if (dragRef.current === null) return;
    const diff = dragRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > THRESHOLD) triggerDepart(diff > 0 ? "left" : "right");
    else setDragX(0);
    dragRef.current = null;
    setGrabbing(false);
  };

  type RItem = { cardIdx: number; transform: string; zIndex: number; transition: string };
  const isDragging = grabbing && !departing;

  const renderItems: RItem[] = departing ? [
    { cardIdx: active % n,     transform: REST[2], zIndex: 6,  transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active+1) % n, transform: REST[0], zIndex: 10, transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active+2) % n, transform: REST[1], zIndex: 9,  transition: `transform ${ANIM_MS}ms ease` },
  ] : [
    { cardIdx: active % n,     transform: dragX !== 0 ? `translateX(${dragX}px) rotate(${-2 + dragX * 0.04}deg)` : REST[0], zIndex: 10, transition: isDragging ? "none" : `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active+1) % n, transform: REST[1], zIndex: 9,  transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active+2) % n, transform: REST[2], zIndex: 8,  transition: `transform ${ANIM_MS}ms ease` },
  ];

  return (
    <div className="polaroid-stack-wrap">
      <div
        ref={stackRef}
        className="polaroid-stack"
        onTouchStart={e => startDrag(e.touches[0].clientX)}
        onTouchMove={handleTouchMove}
        onTouchEnd={endTouchDrag}
        onMouseDown={e => startDrag(e.clientX)}
        style={{ cursor: grabbing ? "grabbing" : "grab" }}
      >
        {renderItems.map(({ cardIdx, transform, zIndex, transition }) => {
          const card = cards[cardIdx];
          return (
            <div key={cardIdx} className="polaroid-card" style={{ transform, zIndex, transition }}>
              <img src={card.url} alt={card.alt} loading="lazy" draggable={false} />
              {card.overlays?.map((o, i) =>
                o.kind === "badge"
                  ? <img key={i} src={o.url} alt="" aria-hidden="true" className="polaroid-badge" style={o.style} draggable={false} />
                  : <div key={i} className="polaroid-text-badge" style={o.style}>{o.text}</div>
              )}
              <span className="polaroid-caption">{card.caption}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

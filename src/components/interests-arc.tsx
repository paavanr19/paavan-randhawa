import { useState, useRef, useEffect } from "react";

type Card = { url: string; alt: string; caption: string; sticker?: string };

const cards: Card[] = [
  { url: "/images/whistler.jpeg", alt: "Whistler, BC", caption: "whistler, bc" },
  { url: "/images/whistler_lost_lake.jpeg", alt: "Biking in Whistler", caption: "biking in whistler" },
  { url: "/images/interests/canucks.png", alt: "Canucks at Rogers Arena", caption: "canucks at rogers arena" },
  { url: "/images/interests/canada-switzerland.png", alt: "FIFA World Cup Canada vs Switzerland", caption: "canada vs. switzerland" },
  { url: "/images/interests/paavan-matchday.png", alt: "Matchday on the pitch", caption: "matchday" },
  { url: "/images/interests/whitecaps.png", alt: "Vancouver Whitecaps at BC Place", caption: "whitecaps at bc place" },
  { url: "/images/tunnelbluffs.png", alt: "Hiking Tunnel Bluffs", caption: "tunnel bluffs hike" },
  { url: "/images/interests/degas-ballerina.png", alt: "Degas' Little Dancer at The Met", caption: "degas @ the met" },
  { url: "/images/interests/monet.png", alt: "Monet Water Lilies at The Met", caption: "monet @ the met" },
  { url: "/images/interests/milo.png", alt: "Milo the dog", caption: "milo!" },
  { url: "/images/interests/positano.png", alt: "Sunny days in Positano", caption: "positano" },
  { url: "/images/interests/wicked-gershwin-theatre.jpg", alt: "Wicked at the Gershwin Theatre", caption: "wicked @ gershwin", sticker: "/images/interests/wicked-playbill-sticker.jpeg" },
];

const REST: [string, string, string] = [
  "rotate(-2deg)",
  "translate(10px, 8px) rotate(5deg)",
  "translate(-8px, 14px) rotate(-3deg)",
];
const THRESHOLD = 18;
const ANIM_MS = 260;

function flyOff(dir: "left" | "right") {
  return dir === "left" ? "translateX(-460px) rotate(-26deg)" : "translateX(460px) rotate(26deg)";
}


export function InterestsArc() {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [departing, setDeparting] = useState<"left" | "right" | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const dragRef = useRef<number | null>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const n = cards.length;

  // Prevent scroll while dragging on touch
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => { if (dragRef.current !== null) e.preventDefault(); };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  useEffect(() => () => { if (animRef.current) clearTimeout(animRef.current); }, []);

  const depart = (dir: "left" | "right") => {
    if (departing) return;
    setDeparting(dir);
    animRef.current = setTimeout(() => {
      setActive(i => dir === "left" ? (i + 1) % n : (i - 1 + n) % n);
      setDeparting(null);
      setDragX(0);
    }, ANIM_MS);
  };

  const startDrag = (x: number) => { if (!departing) { dragRef.current = x; setGrabbing(true); } };
  const moveDrag = (x: number) => { if (dragRef.current !== null && !departing) setDragX(x - dragRef.current); };
  const endDrag = (x: number) => {
    if (dragRef.current === null) return;
    const diff = dragRef.current - x;
    if (Math.abs(diff) > THRESHOLD) depart(diff > 0 ? "left" : "right");
    else setDragX(0);
    dragRef.current = null;
    setGrabbing(false);
  };
  const cancelDrag = () => { dragRef.current = null; setDragX(0); setGrabbing(false); };

  // Build render list: 4 items during departure, 3 otherwise
  // Key by card index so React preserves identity across active changes
  type RItem = { cardIdx: number; transform: string; zIndex: number; transition: string };
  const isDragging = grabbing && !departing;

  const renderItems: RItem[] = departing ? [
    { cardIdx: active % n,           transform: flyOff(departing), zIndex: 15, transition: `transform ${ANIM_MS}ms ease-in` },
    { cardIdx: (active + 1) % n,     transform: REST[0],           zIndex: 10, transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active + 2) % n,     transform: REST[1],           zIndex: 9,  transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active + 3) % n,     transform: REST[2],           zIndex: 8,  transition: "none" },
  ] : [
    { cardIdx: active % n,           transform: dragX !== 0 ? `translateX(${dragX}px) rotate(${-2 + dragX * 0.04}deg)` : REST[0], zIndex: 10, transition: isDragging ? "none" : `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active + 1) % n,     transform: REST[1],           zIndex: 9,  transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active + 2) % n,     transform: REST[2],           zIndex: 8,  transition: `transform ${ANIM_MS}ms ease` },
  ];

  return (
    <div className="polaroid-stack-wrap">
      <div
        ref={stackRef}
        className="polaroid-stack"
        onTouchStart={e => startDrag(e.touches[0].clientX)}
        onTouchEnd={e => endDrag(e.changedTouches[0].clientX)}
        onMouseDown={e => startDrag(e.clientX)}
        onMouseMove={e => moveDrag(e.clientX)}
        onMouseUp={e => endDrag(e.clientX)}
        onMouseLeave={cancelDrag}
        style={{ cursor: grabbing ? "grabbing" : "grab" }}
      >
        {renderItems.map(({ cardIdx, transform, zIndex, transition }) => {
          const card = cards[cardIdx];
          return (
            <div key={cardIdx} className="polaroid-card" style={{ transform, zIndex, transition }}>
              <img src={card.url} alt={card.alt} loading="lazy" draggable={false} />
              {card.sticker && <img src={card.sticker} alt="" aria-hidden="true" className="polaroid-sticker" draggable={false} />}
              <span className="polaroid-caption">{card.caption}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

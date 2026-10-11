import { useState, useRef, useEffect } from "react";

type Card = { url: string; alt: string; caption: string; sticker?: string; badge?: { url: string; style: React.CSSProperties } };

const cards: Card[] = [
  { url: "/images/whistler.jpeg", alt: "Whistler, BC", caption: "whistler" },
  { url: "/images/whistler_lost_lake.jpeg", alt: "Biking in Whistler", caption: "biking in whistler" },
  { url: "/images/interests/canucks.png", alt: "Canucks at Rogers Arena", caption: "canucks at rogers arena", badge: { url: "/images/logos/canucks-logo.png", style: { bottom: 14, left: 10 } } },
  { url: "/images/interests/canada-switzerland.png", alt: "FIFA World Cup Canada vs Switzerland", caption: "canada vs. switzerland @ the world cup" },
  { url: "/images/interests/paavan-matchday.png", alt: "Matchday on the pitch", caption: "matchday" },
  { url: "/images/interests/whitecaps.png", alt: "Vancouver Whitecaps at BC Place", caption: "whitecaps @ BC place", badge: { url: "/images/logos/whitecaps-logo.png", style: { top: 14, left: 10 } } },
  { url: "/images/tunnelbluffs.png", alt: "Hiking Tunnel Bluffs", caption: "tunnel bluffs hike" },
  { url: "/images/interests/degas-ballerina.png", alt: "Degas' Little Dancer at The Met", caption: "degas @ the met" },
  { url: "/images/interests/monet.png", alt: "Monet Water Lilies at The Met", caption: "monet @ the met" },
  { url: "/images/interests/milo.png", alt: "Milo the dog", caption: "my dog, milo!" },
  { url: "/images/interests/positano.png", alt: "Sunny days in Positano", caption: "positano, italy" },
  { url: "/images/interests/wicked-gershwin-theatre.jpg", alt: "Wicked at the Gershwin Theatre", caption: "wicked on broadway", sticker: "/images/interests/wicked-playbill-sticker.jpeg" },
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

  // Prevent scroll on touch while dragging
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    const handler = (e: TouchEvent) => { if (dragRef.current !== null) e.preventDefault(); };
    el.addEventListener("touchmove", handler, { passive: false });
    return () => el.removeEventListener("touchmove", handler);
  }, []);

  // Global mouse tracking so drag doesn't cancel when cursor leaves the stack
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

  const startDrag = (x: number) => {
    if (departing) return;
    dragRef.current = x;
    setGrabbing(true);
  };

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
    { cardIdx: active % n,       transform: REST[2], zIndex: 6,  transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active+1) % n,   transform: REST[0], zIndex: 10, transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active+2) % n,   transform: REST[1], zIndex: 9,  transition: `transform ${ANIM_MS}ms ease` },
  ] : [
    { cardIdx: active % n,       transform: dragX !== 0 ? `translateX(${dragX}px) rotate(${-2 + dragX * 0.04}deg)` : REST[0], zIndex: 10, transition: isDragging ? "none" : `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active+1) % n,   transform: REST[1], zIndex: 9,  transition: `transform ${ANIM_MS}ms ease` },
    { cardIdx: (active+2) % n,   transform: REST[2], zIndex: 8,  transition: `transform ${ANIM_MS}ms ease` },
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
              {card.badge && <img src={card.badge.url} alt="" aria-hidden="true" className="polaroid-badge" style={card.badge.style} draggable={false} />}
              {card.sticker && <img src={card.sticker} alt="" aria-hidden="true" className="polaroid-sticker" draggable={false} />}
              <span className="polaroid-caption">{card.caption}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

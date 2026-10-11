import { useState, useRef } from "react";
import { interestsAssets } from "@/lib/interests-assets";

const photos = [
  { url: interestsAssets.lostLake.url, alt: "Biking in Whistler" },
  { url: interestsAssets.canucks.url, alt: "Canucks at Rogers Arena" },
  { url: interestsAssets.worldCup.url, alt: "FIFA World Cup Canada vs Switzerland" },
  { url: interestsAssets.soccer.url, alt: "Matchday on the pitch" },
  { url: interestsAssets.tunnelBluffs.url, alt: "Hiking Tunnel Bluffs" },
  { url: interestsAssets.degas.url, alt: "Degas' Little Dancer at The Met" },
  { url: interestsAssets.monet.url, alt: "Monet Water Lilies at The Met" },
  { url: interestsAssets.milo.url, alt: "Milo the dog" },
  { url: interestsAssets.positano.url, alt: "Sunny days in Positano" },
  { url: interestsAssets.wicked.url, alt: "Wicked at the Gershwin Theatre" },
];

const stackTransforms = [
  "rotate(-2deg)",
  "translate(10px, 8px) rotate(5deg)",
  "translate(-8px, 14px) rotate(-3deg)",
];

export function InterestsArc() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const n = photos.length;

  const next = () => setActive(i => (i + 1) % n);
  const prev = () => setActive(i => (i - 1 + n) % n);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStart.current = null;
  };

  return (
    <div className="polaroid-stack-wrap">
      <div className="polaroid-stack" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {[2, 1, 0].map(offset => {
          const photo = photos[(active + offset) % n];
          return (
            <div
              key={offset}
              className="polaroid-card"
              style={{ transform: stackTransforms[offset], zIndex: 10 - offset }}
            >
              <img src={photo.url} alt={photo.alt} loading="lazy" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

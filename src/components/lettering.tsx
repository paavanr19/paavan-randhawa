import type { CSSProperties } from "react";

const pointers = import.meta.glob<{ url: string }>("@/assets/lettering/*.asset.json", { eager: true, import: "default" });
const sizes: Record<string, [number, number]> = { paavan: [718, 248], randhawa: [1044, 262], projects: [825, 315], "unix-shell": [1030, 262], "mythos-seafarer": [748, 150], pocoloco: [402, 121], "rubiks-cube-solver": [890, 122], education: [452, 122], skills: [248, 121], courses: [357, 115], certifications: [613, 121], interests: [413, 114], "contact-me": [526, 115] };

export function letteringSlug(text: string) {
  return text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Hand-set Molinelo wordmark exported from Canva; tinted by currentColor via CSS mask. Falls back to text. */
export function Lettering({ text, reveal }: { text: string; reveal?: number }) {
  const slug = letteringSlug(text);
  const ptr = Object.entries(pointers).find(([p]) => p.endsWith(`/${slug}.png.asset.json`))?.[1];
  const size = sizes[slug];
  if (!ptr || !size) return <>{text}</>;
  const style = { "--lettering-url": `url("${ptr.url}")`, "--lettering-ratio": size[0] / size[1], "--lettering-reveal": reveal ?? 1 } as CSSProperties;
  return <span className="lettering" data-word={slug} style={style}><span className="sr-only">{text}</span></span>;
}

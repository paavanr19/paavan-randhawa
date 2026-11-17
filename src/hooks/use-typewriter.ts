import { useEffect, useState } from "react";

export function useTypewriter(length: number) {
  const [characters, setCharacters] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    const start = () => {
      window.clearTimeout(timer);
      if (motion.matches) {
        setCharacters(length);
        return;
      }
      let count = 0;
      setCharacters(0);
      const typeNext = () => {
        count += 1;
        setCharacters(count);
        if (count < length) timer = window.setTimeout(typeNext, 85);
      };
      timer = window.setTimeout(typeNext, 250);
    };

    start();
    motion.addEventListener("change", start);
    return () => {
      window.clearTimeout(timer);
      motion.removeEventListener("change", start);
    };
  }, [length]);

  return characters;
}
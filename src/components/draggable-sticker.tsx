import { useState, useRef, useEffect } from "react";

export function DraggableSticker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      setOffset({ x: dragStart.current.ox + e.clientX - dragStart.current.mx, y: dragStart.current.oy + e.clientY - dragStart.current.my });
    };
    const onUp = () => { dragStart.current = null; setDragging(false); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  useEffect(() => {
    if (!dragging) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!dragStart.current) return;
      const t = e.touches[0];
      if (!t) return;
      e.preventDefault();
      setOffset({ x: dragStart.current.ox + t.clientX - dragStart.current.mx, y: dragStart.current.oy + t.clientY - dragStart.current.my });
    };
    const onTouchEnd = () => { dragStart.current = null; setDragging(false); };
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => { window.removeEventListener("touchmove", onTouchMove); window.removeEventListener("touchend", onTouchEnd); };
  }, [dragging]);

  return (
    <span
      className={`draggable-sticker${className ? ` ${className}` : ""}`}
      onMouseDown={e => { e.preventDefault(); dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y }; setDragging(true); }}
      onTouchStart={e => { const t = e.touches[0]; if (!t) return; dragStart.current = { mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y }; setDragging(true); }}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)${dragging ? " scale(1.28)" : ""}`,
        transition: dragging ? "filter 0.08s" : "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s",
        filter: dragging ? "drop-shadow(4px 10px 18px rgba(0,0,0,0.42))" : undefined,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: dragging ? 50 : undefined,
      }}
    >
      {children}
    </span>
  );
}

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export function DraggableSticker({
  children,
  className = "",
  defaultXVw,
  defaultYVh,
}: {
  children: React.ReactNode;
  className?: string;
  // Viewport-relative initial position (vw/vh percentages 0-100).
  // When provided, the sticker portals to document.body and uses JS-computed
  // position:fixed so no CSS containing-block ancestor can interfere.
  defaultXVw?: number;
  defaultYVh?: number;
}) {
  const elemRef = useRef<HTMLSpanElement>(null);
  const [fixedPos, setFixedPos] = useState<{ x: number; y: number } | null>(null);
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const fixedPosRef = useRef<{ x: number; y: number } | null>(null);
  const deltaRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef<{ mx: number; my: number } | null>(null);

  // For viewport-stickers: compute initial position from vw/vh on mount.
  // These only render after user interaction (altTheme toggle), so document is
  // always available — no SSR guard needed.
  useEffect(() => {
    if (defaultXVw !== undefined && defaultYVh !== undefined && fixedPosRef.current === null) {
      const pos = {
        x: window.innerWidth * defaultXVw / 100,
        y: window.innerHeight * defaultYVh / 100,
      };
      fixedPosRef.current = pos;
      setFixedPos(pos);
    }
  }, []);

  function startDrag(mx: number, my: number) {
    if (fixedPosRef.current === null && elemRef.current) {
      const rect = elemRef.current.getBoundingClientRect();
      const pos = { x: rect.left, y: rect.top };
      fixedPosRef.current = pos;
      setFixedPos(pos);
    }
    deltaRef.current = { x: 0, y: 0 };
    dragStartRef.current = { mx, my };
    setDelta({ x: 0, y: 0 });
    setDragging(true);
  }

  function commitDrag() {
    const fp = fixedPosRef.current;
    const d = deltaRef.current;
    if (fp !== null) {
      const newPos = { x: fp.x + d.x, y: fp.y + d.y };
      fixedPosRef.current = newPos;
      setFixedPos(newPos);
    }
    deltaRef.current = { x: 0, y: 0 };
    setDelta({ x: 0, y: 0 });
    dragStartRef.current = null;
    setDragging(false);
  }

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const d = { x: e.clientX - dragStartRef.current.mx, y: e.clientY - dragStartRef.current.my };
      deltaRef.current = d;
      setDelta(d);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", commitDrag);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", commitDrag); };
  }, [dragging]);

  useEffect(() => {
    if (!dragging) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current) return;
      const t = e.touches[0];
      if (!t) return;
      e.preventDefault();
      const d = { x: t.clientX - dragStartRef.current.mx, y: t.clientY - dragStartRef.current.my };
      deltaRef.current = d;
      setDelta(d);
    };
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", commitDrag);
    return () => { window.removeEventListener("touchmove", onTouchMove); window.removeEventListener("touchend", commitDrag); };
  }, [dragging]);

  const isFixed = fixedPos !== null;
  const fx = (fixedPos?.x ?? 0) + delta.x;
  const fy = (fixedPos?.y ?? 0) + delta.y;
  const isViewportSticker = defaultXVw !== undefined;

  // Don't render viewport-stickers until their JS position is ready.
  if (isViewportSticker && !isFixed) return null;

  const span = (
    <span
      ref={elemRef}
      className={`draggable-sticker${className ? ` ${className}` : ""}`}
      onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
      onTouchStart={e => { const t = e.touches[0]; if (!t) return; startDrag(t.clientX, t.clientY); }}
      style={{
        position: isFixed ? "fixed" : undefined,
        left: isFixed ? fx : undefined,
        top: isFixed ? fy : undefined,
        transform: dragging ? "scale(1.28)" : undefined,
        transition: dragging ? "filter 0.08s" : "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s",
        filter: dragging ? "drop-shadow(4px 10px 18px rgba(0,0,0,0.42))" : undefined,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: isFixed || dragging ? 50 : undefined,
      }}
    >
      {children}
    </span>
  );

  // Viewport-stickers always portal to body so position:fixed is unconditionally
  // viewport-relative, regardless of any ancestor containing-block.
  if (isViewportSticker || isFixed) return createPortal(span, document.body);
  return span;
}

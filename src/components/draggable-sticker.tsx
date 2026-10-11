import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// "doc"   → position:absolute in document space; sticker scrolls with the page.
// "fixed" → position:fixed in viewport space; sticker stays on screen (e.g. sticky navbar).
type PlacementMode = "doc" | "fixed";
type Pos = { x: number; y: number };

export function DraggableSticker({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const elemRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<PlacementMode>("doc");
  const [pos, setPos] = useState<Pos | null>(null);
  const [delta, setDelta] = useState<Pos>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Refs for synchronous access inside event handlers.
  const modeRef = useRef<PlacementMode>("doc");
  const posRef = useRef<Pos | null>(null);
  const deltaRef = useRef<Pos>({ x: 0, y: 0 });
  // Drag anchor and sticker start — both in document space.
  const dragAnchorRef = useRef<Pos | null>(null);
  const dragStartPosRef = useRef<Pos | null>(null);
  // Last known cursor viewport position — used for navbar drop detection.
  const lastCursorRef = useRef<Pos>({ x: 0, y: 0 });

  // Returns the sticker's current position in document coordinates.
  function currentDocPos(): Pos {
    if (posRef.current !== null) {
      const p = posRef.current;
      return modeRef.current === "fixed"
        ? { x: p.x + window.scrollX, y: p.y + window.scrollY }
        : p;
    }
    if (elemRef.current) {
      const r = elemRef.current.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.top + window.scrollY };
    }
    return { x: 0, y: 0 };
  }

  function startDrag(clientX: number, clientY: number) {
    lastCursorRef.current = { x: clientX, y: clientY };
    const startDoc = currentDocPos();
    dragStartPosRef.current = startDoc;
    dragAnchorRef.current = { x: clientX + window.scrollX, y: clientY + window.scrollY };

    // Render in doc mode during drag so the element scrolls naturally while being moved.
    const tempPos: Pos = startDoc;
    posRef.current = tempPos;
    modeRef.current = "doc";
    setPos(tempPos);
    setMode("doc");

    deltaRef.current = { x: 0, y: 0 };
    setDelta({ x: 0, y: 0 });
    setDragging(true);
  }

  function commitDrag() {
    const start = dragStartPosRef.current;
    const d = deltaRef.current;

    if (start !== null) {
      const newDocX = start.x + d.x;
      const newDocY = start.y + d.y;

      // Use the cursor's viewport position for navbar detection — the sticker's
      // top-left can be outside the navbar rect even when the cursor is clearly on it.
      const { x: cursorVX, y: cursorVY } = lastCursorRef.current;
      const navEl = document.querySelector<HTMLElement>(".portfolio-nav");
      if (navEl) {
        const nr = navEl.getBoundingClientRect();
        if (cursorVY >= nr.top && cursorVY <= nr.bottom && cursorVX >= nr.left && cursorVX <= nr.right) {
          const vp: Pos = { x: newDocX - window.scrollX, y: newDocY - window.scrollY };
          posRef.current = vp;
          modeRef.current = "fixed";
          setPos(vp);
          setMode("fixed");
          deltaRef.current = { x: 0, y: 0 };
          setDelta({ x: 0, y: 0 });
          dragStartPosRef.current = null;
          dragAnchorRef.current = null;
          setDragging(false);
          return;
        }
      }

      const docP: Pos = { x: newDocX, y: newDocY };
      posRef.current = docP;
      modeRef.current = "doc";
      setPos(docP);
      setMode("doc");
    }

    deltaRef.current = { x: 0, y: 0 };
    setDelta({ x: 0, y: 0 });
    dragStartPosRef.current = null;
    dragAnchorRef.current = null;
    setDragging(false);
  }

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragAnchorRef.current) return;
      lastCursorRef.current = { x: e.clientX, y: e.clientY };
      const d: Pos = {
        x: (e.clientX + window.scrollX) - dragAnchorRef.current.x,
        y: (e.clientY + window.scrollY) - dragAnchorRef.current.y,
      };
      deltaRef.current = d;
      setDelta(d);
    };
    const onUp = (e: MouseEvent) => { lastCursorRef.current = { x: e.clientX, y: e.clientY }; commitDrag(); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  useEffect(() => {
    if (!dragging) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!dragAnchorRef.current) return;
      const t = e.touches[0];
      if (!t) return;
      e.preventDefault();
      lastCursorRef.current = { x: t.clientX, y: t.clientY };
      const d: Pos = {
        x: (t.clientX + window.scrollX) - dragAnchorRef.current.x,
        y: (t.clientY + window.scrollY) - dragAnchorRef.current.y,
      };
      deltaRef.current = d;
      setDelta(d);
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (t) lastCursorRef.current = { x: t.clientX, y: t.clientY };
      commitDrag();
    };
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => { window.removeEventListener("touchmove", onTouchMove); window.removeEventListener("touchend", onTouchEnd); };
  }, [dragging]);

  const isPlaced = pos !== null;
  const fx = (pos?.x ?? 0) + delta.x;
  const fy = (pos?.y ?? 0) + delta.y;
  const cssPosition = (isPlaced && !dragging && mode === "fixed") ? "fixed" : (isPlaced ? "absolute" : undefined);

  const span = (
    <span
      ref={elemRef}
      className={`draggable-sticker${className ? ` ${className}` : ""}`}
      onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
      onTouchStart={e => { const t = e.touches[0]; if (!t) return; startDrag(t.clientX, t.clientY); }}
      style={{
        position: cssPosition,
        left: isPlaced ? fx : undefined,
        top: isPlaced ? fy : undefined,
        // Cancel any bottom/right from CSS classes (e.g. .portrait-heart-wrap) that would
        // stretch or misplace the element once it's portaled out of its original parent.
        bottom: isPlaced ? "auto" : undefined,
        right: isPlaced ? "auto" : undefined,
        transform: dragging ? "scale(1.28)" : undefined,
        transition: dragging ? "filter 0.08s" : "transform 0.55s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s",
        filter: dragging ? "drop-shadow(4px 10px 18px rgba(0,0,0,0.42))" : undefined,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: isPlaced || dragging ? 50 : undefined,
      }}
    >
      {children}
    </span>
  );

  if (isPlaced) return createPortal(span, document.body);
  return span;
}

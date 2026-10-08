export function PixelSticker({ kind = "star", className = "" }: { kind?: "star" | "heart"; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`pixel-sticker ${className}`}>
      {kind === "star" ? <>
        <path fill="currentColor" d="M10 1h4v5h3v3h6v4h-4v3h-3v7h-4v-3H9v3H5v-7H2v-3H0V9h7V6h3z" />
        <path fill="var(--background)" d="M11 4h2v5h3v3h4v1h-4v3h-3v3h-2v-3H8v-3H4v-1h4V9h3z" />
      </> : <>
        <path fill="var(--foreground)" d="M3 3h6v3h6V3h6v3h3v9h-3v3h-3v3h-3v3H9v-3H6v-3H3v-3H0V6h3z" />
        <path fill="currentColor" d="M3 6h6v3h6V6h6v9h-3v3h-3v3H9v-3H6v-3H3z" />
        <path fill="var(--background)" d="M4 7h3v3H4z" />
      </>}
    </svg>
  );
}
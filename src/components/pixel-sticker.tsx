export function PixelSticker({ kind = "star", className = "" }: { kind?: "star" | "heart" | "cursor" | "envelope"; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`pixel-sticker ${className}`}>
      {kind === "cursor" ? <>
        <path fill="var(--foreground)" d="M3 1h3v3h3v3h3v3h3v3h3v3h-6v3h3v3H9v-6H6v3H3z" />
        <path fill="var(--secondary)" d="M6 7h3v3h3v3H9v3H6z" />
      </> : kind === "envelope" ? <>
        <path fill="currentColor" d="M0 4h24v16H0z" />
        <path fill="var(--background)" d="M2 6h20v12H2z" />
        <path fill="currentColor" d="M2 6h3v3h3v3h8V9h3V6h3v3h-3v3h-3v3H8v-3H5V9H2z" />
      </> : kind === "star" ? <>
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
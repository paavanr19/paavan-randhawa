export function PixelSticker({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`pixel-sticker ${className}`}>
      <path fill="currentColor" d="M0 4h24v16H0z" />
      <path fill="var(--background)" d="M2 6h20v12H2z" />
      <path fill="currentColor" d="M2 6h3v3h3v3h8V9h3V6h3v3h-3v3h-3v3H8v-3H5V9H2z" />
    </svg>
  );
}

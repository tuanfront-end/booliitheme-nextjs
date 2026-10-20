import type { SVGProps } from "react";

// The studio's mark — an "iB" built from four colours on a tilted yellow tile —
// as the studio supplied it, redrawn to its geometry so it renders before any
// image loads. Its colours are the mark's own and do not follow the theme.
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" {...props}>
      <rect x="46" y="46" width="420" height="420" rx="76" transform="rotate(15 256 256)" fill="#FED651" />
      <path d="M160 228V200a28 28 0 0 1 56 0a28 28 0 0 1-28 28Z" fill="#EA4335" />
      <path d="M210 242v56h-28a28 28 0 0 1 0-56Z" fill="#1A73E8" />
      <path d="M210 299v56h-28a28 28 0 0 1 0-56Z" fill="#34A853" />
      <path d="M231 160h34v195h-34Z" fill="#1A73E8" />
      <path d="M307 160a41.5 41.5 0 0 1 0 83Z" fill="#1A73E8" />
      <path d="M265 160h42v83a42 42 0 0 1-42-42Z" fill="#174EA6" />
      <path d="M307 243a56 56 0 0 1 0 112Z" fill="#34A853" />
      <path d="M307 243v112h-54v-58a54 54 0 0 1 54-54Z" fill="#0D652D" />
    </svg>
  );
}

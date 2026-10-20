import Image, { type StaticImageData } from "next/image";

import { hostOf } from "@/lib/format";
import { cn } from "@/lib/utils";

// A template's screenshot as it is met: in a browser window, with the demo's
// real host in the address bar. The niche object the listing card is drawn
// from — every claim on this site is a page the buyer can open, and the frame
// says which one. Given a second shot, it crossfades to it while anything
// marked `group/frame` above it is hovered or focused.
//
// The shot inside is a real raster image, so the page's picture count measures
// it as one; the frame takes no `data-picture`, which is for mockups drawn in
// the DOM.
export function BrowserFrame({
  shots,
  url,
  alt,
  sizes,
  priority = false,
  aspect = "aspect-[16/11]",
  className,
}: {
  shots: StaticImageData[];
  url: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** The window's own proportion; the shot is cropped to it from its top-left. */
  aspect?: string;
  className?: string;
}) {
  const [first, second] = shots;
  return (
    <div
      className={cn("flex flex-col overflow-hidden rounded-md bg-card ring-1 ring-border ring-inset", className)}
    >
      <div className="flex h-8 shrink-0 items-center gap-3 border-b border-border px-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2 rounded-full bg-muted-foreground/30" />
          <span className="size-2 rounded-full bg-muted-foreground/30" />
          <span className="size-2 rounded-full bg-muted-foreground/30" />
        </span>
        <span className="mx-auto min-w-0 truncate rounded-control bg-accent px-3 py-0.5 text-xs text-muted-foreground">
          {hostOf(url)}
        </span>
        <span aria-hidden="true" className="w-[2.625rem]" />
      </div>
      <div className={cn("relative w-full overflow-hidden bg-muted", aspect)}>
        <Image src={first} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-left-top" />
        {second ? (
          <Image
            src={second}
            alt=""
            fill
            sizes={sizes}
            className="object-cover object-left-top opacity-0 transition-opacity duration-arrive ease-answer group-hover/frame:opacity-100 group-focus-within/frame:opacity-100 motion-reduce:transition-none"
          />
        ) : null}
      </div>
    </div>
  );
}

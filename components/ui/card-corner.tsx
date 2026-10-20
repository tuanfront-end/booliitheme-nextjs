// CardCorner — the arrow disc in a link card's corner that comes in when the card is hovered or its link is reached by keyboard, saying the whole card goes somewhere.
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

/** Put on the card the corner answers: the `group relative` element that
 *  holds its one stretched link. */
const cardCornerGroup = "group/corner";

// In place of a lifting shadow, a white disc rises 4px and fades in. Hidden
// at rest rather than merely transparent, so it is nothing to a reader or a
// checker until it shows. It is drawn, never pressed: the card's link is the
// target, so the disc lets every click fall through to it and needs no hit
// area of its own — the whole card is its reach. Keyboard focus shows it only
// when the focus is on a link in the card, so tabbing to the card's own Save
// does not promise a page the heart does not open.
//
// 36px on a small or a medium card, where 40 reads heavy against the photo;
// `lg` is the 40px disc for a feature card that spans half a row or more. The
// corner is `top-3 end-3` unless `className` moves it; the nearest positioned
// ancestor — usually the photo's frame — is the box it is placed in.
function CardCorner({ size = "default", className }: { size?: "default" | "lg"; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-slot="card-corner"
      className={cn(
        "pointer-events-none invisible absolute top-3 inset-e-3 z-10 grid translate-y-1 place-items-center rounded-full bg-card text-foreground opacity-0 shadow-soft transition-[opacity,translate,visibility] duration-answer ease-answer motion-reduce:transition-none",
        "group-hover/corner:visible group-hover/corner:translate-y-0 group-hover/corner:opacity-100",
        "group-has-[a:focus-visible]/corner:visible group-has-[a:focus-visible]/corner:translate-y-0 group-has-[a:focus-visible]/corner:opacity-100",
        "group-focus-visible/corner:visible group-focus-visible/corner:translate-y-0 group-focus-visible/corner:opacity-100",
        size === "lg" ? "size-10" : "size-9",
        className,
      )}
    >
      <ArrowUpRightIcon className="size-4 rtl:-scale-x-100" />
    </span>
  );
}

export { CardCorner, cardCornerGroup };

// Rating — a score out of five drawn as stars, the next star filled to the score's fraction, and read out as one image.
import { StarIcon } from "@heroicons/react/24/solid";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Five stars are one mark, not five, so the row is `gap-px` and carries one
// name: "Rated 4.7 out of 5". The stars up to the score's whole number are
// filled, the next is filled to the fraction — a second solid star clipped
// over the empty one, since Heroicons ships no half star — and the rest are
// empty. A 4.7 reads as four and most of a fifth, not as five.
//
// Two tones and no others. `brand`, the default, is the bright brand; `ink`
// is the text colour. The empty stars are the same solid star in a quiet
// neutral, so the row reads as a share of five rather than as five outlines.
// A light brand — a lime, a sun — draws under 3:1 on a white card, so a brand
// rating always stands beside its score printed as a number, and the stars
// are the number's picture; a row with no number beside it goes `ink`.
const ratingVariants = cva("inline-flex shrink-0 items-center gap-px", {
  variants: {
    tone: {
      brand: "text-primary",
      ink: "text-foreground",
    },
    // `sm` sits inside a line of text; `md` beside a figure set larger than
    // the text around it.
    size: {
      sm: "[&_svg]:size-3.5",
      md: "[&_svg]:size-5",
    },
  },
  defaultVariants: { tone: "brand", size: "sm" },
});

function Rating({
  value,
  max = 5,
  label,
  tone,
  size,
  className,
}: VariantProps<typeof ratingVariants> & {
  value: number;
  max?: number;
  /** What a screen reader hears instead of the default sentence. */
  label?: string;
  className?: string;
}) {
  const score = Math.min(max, Math.max(0, value));
  const whole = Math.floor(score);
  return (
    <span
      role="img"
      aria-label={label ?? `Rated ${score} out of ${max}`}
      data-slot="rating"
      className={cn(ratingVariants({ tone, size }), className)}
    >
      {Array.from({ length: max }, (_, i) => {
        const fill = i < whole ? 1 : i === whole ? score - whole : 0;
        // The part-filled star is two drawings stacked in one grid cell rather
        // than positioned: nothing in the row is `relative`, so a rating in a
        // link card's footer stays under the card's stretched link and a press
        // on it opens the card like any other part of it.
        return (
          <span key={i} aria-hidden="true" className="grid shrink-0">
            <StarIcon className={cn("col-start-1 row-start-1", fill < 1 && "text-foreground/15")} />
            {fill > 0 && fill < 1 && (
              // Clipped from the start of the star, so on a right-to-left page
              // the fraction fills from the right, where the row begins.
              <span
                className="col-start-1 row-start-1 justify-self-start overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <StarIcon className="max-w-none" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export { Rating, ratingVariants };

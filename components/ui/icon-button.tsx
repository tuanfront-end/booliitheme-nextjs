// IconButton — one glyph as a control, a circle at the pill seed and a rounded square at a squared one, its spoken name required by its type.
import { Button, type ButtonProps } from "@/components/ui/button";

// The Button underneath, at the three square sizes it keeps for this: 36
// reaching 40 for a row of quiet tools, 40 everywhere else, and 44 for the
// one disc a section is built around. The corner is the control seed, so the
// whole set changes register with every other control when a buyer squares
// their buttons.
const SIZE = { sm: "icon-sm", default: "icon", lg: "icon-lg" } as const;

type IconButtonProps = Omit<ButtonProps, "size" | "variant"> & {
  /** What a screen reader says, and what a tooltip over it should say too.
   *  Required: a glyph says nothing aloud, and an unnamed button is read as
   *  "button". */
  "aria-label": string;
  size?: keyof typeof SIZE;
  variant?: Exclude<NonNullable<ButtonProps["variant"]>, "link">;
};

function IconButton({ size = "default", variant = "ghost", ...props }: IconButtonProps) {
  return <Button data-slot="icon-button" size={SIZE[size]} variant={variant} {...props} />;
}

export { IconButton, type IconButtonProps };

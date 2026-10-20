// ShareMenu — a share button whose menu sends a listing's link: a preview of what is shared, Copy link, mail, messages, four networks and the device's own sheet.
"use client";

import * as React from "react";
import Image from "next/image";
import { Menu } from "@base-ui/react/menu";
import {
  Copy01Icon,
  Facebook01Icon,
  Mail01Icon,
  Message01Icon,
  MoreHorizontalIcon,
  NewTwitterIcon,
  Share03Icon,
  ThreadsIcon,
  Tick02Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

// Where a link goes, each with the service's own share page and the link and
// a line already filled in. Mail and Messages hand off to the device's app, so
// they open in place; the four networks open beside the page.
const PLACES: {
  name: string;
  icon: IconSvgElement;
  app?: boolean;
  href: (url: string, line: string) => string;
}[] = [
  { name: "Email", icon: Mail01Icon, app: true, href: (url, line) => `mailto:?subject=${encodeURIComponent(line)}&body=${encodeURIComponent(url)}` },
  { name: "Messages", icon: Message01Icon, app: true, href: (url, line) => `sms:?&body=${encodeURIComponent(`${line} ${url}`)}` },
  { name: "WhatsApp", icon: WhatsappIcon, href: (url, line) => `https://wa.me/?text=${encodeURIComponent(`${line} ${url}`)}` },
  { name: "Facebook", icon: Facebook01Icon, href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: "X", icon: NewTwitterIcon, href: (url, line) => `https://x.com/intent/post?text=${encodeURIComponent(line)}&url=${encodeURIComponent(url)}` },
  { name: "Threads", icon: ThreadsIcon, href: (url, line) => `https://www.threads.net/intent/post?text=${encodeURIComponent(`${line} ${url}`)}` },
];

// A row is 40px, the reach of every control. The highlight is the whisper a
// pointer gets; a keyboard also gets the ring, drawn inside the row so the
// rows above and below do not cut it.
const ROW =
  "flex min-h-10 cursor-default items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-foreground select-none data-highlighted:bg-accent active:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&_svg]:shrink-0 [&_svg]:text-muted-foreground";

// The Clipboard API, and the old command where it is missing: outside a
// secure context, or in a browser that refuses it. The second try borrows a
// hidden field and gives focus back to whatever held it.
async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // falls through to the command
  }
  const held = document.activeElement as HTMLElement | null;
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.cssText = "position:fixed;top:0;opacity:0;pointer-events:none";
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  held?.focus({ preventScroll: true });
  return ok;
}

type ShareMenuProps = {
  /** The page being shared. A path is resolved against the current site. */
  url: string;
  /** What is shared, as the menu's preview and the line sent with the link. */
  title: string;
  /** The preview's second line: a place, a date, a price. */
  meta?: string;
  /** The preview's picture. */
  image?: string;
  /** The line sent with the link, when it should say more than the title. */
  text?: string;
  /** A glyph alone, or the glyph and the word Share. */
  labelled?: boolean;
  variant?: "outline" | "ghost" | "secondary";
  align?: "start" | "center" | "end";
  className?: string;
};

function ShareMenu({
  url,
  title,
  meta,
  image,
  text,
  labelled = false,
  variant = "outline",
  align = "center",
  className,
}: ShareMenuProps) {
  const [copied, setCopied] = React.useState(false);
  // What the live region says when no Toaster is mounted to say it.
  const [said, setSaid] = React.useState("");

  React.useEffect(() => {
    if (!copied && !said) return;
    const timer = window.setTimeout(() => {
      setCopied(false);
      setSaid("");
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [copied, said]);

  const copy = async (link: string) => {
    const ok = await writeClipboard(link);
    setCopied(ok);
    const message = ok ? "Link copied" : "Couldn't copy the link";
    // The toast is the announcement where the page has one; the polite region
    // beside the button says the same where it has not.
    const shown = toast(message, ok ? { type: "success" } : { type: "error", description: link });
    if (!shown) setSaid(message);
  };

  const glyph = copied ? (
    <HugeiconsIcon
      icon={Tick02Icon}
      strokeWidth={1.5}
      aria-hidden="true"
      data-icon={labelled ? "inline-start" : undefined}
    />
  ) : (
    <HugeiconsIcon
      icon={Share03Icon}
      strokeWidth={1.5}
      aria-hidden="true"
      data-icon={labelled ? "inline-start" : undefined}
    />
  );

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          data-slot="share-menu-trigger"
          render={
            labelled ? (
              <Button variant={variant} className={className} />
            ) : (
              <IconButton variant={variant} aria-label={`Share ${title}`} className={className} />
            )
          }
        >
          {glyph}
          {labelled ? (
            <>
              Share<span className="sr-only"> {title}</span>
            </>
          ) : null}
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="bottom" align={align} sideOffset={8} collisionPadding={16} className="isolate z-50">
            <Menu.Popup
              data-slot="share-menu"
              className="max-h-(--available-height) w-[min(calc(100vw-2rem),18rem)] origin-(--transform-origin) overflow-y-auto rounded-lg bg-popover p-2 text-popover-foreground shadow-soft-lg no-scrollbar outline-none transition-[opacity,scale] duration-spring ease-spring data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-answer data-ending-style:ease-answer"
            >
              <ShareRows url={url} title={title} meta={meta} image={image} text={text} onCopy={copy} />
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <span role="status" className="sr-only">
        {said}
      </span>
    </>
  );
}

// Rendered only while the menu is open, so it reads the address and the
// share sheet off the browser with no server render to disagree with.
function ShareRows({
  url,
  title,
  meta,
  image,
  text,
  onCopy,
}: Pick<ShareMenuProps, "url" | "title" | "meta" | "image" | "text"> & {
  onCopy: (link: string) => void;
}) {
  const link = new URL(url, window.location.href).toString();
  const line = text ?? (meta ? `${title}, ${meta}` : title);
  const sheet = typeof navigator.share === "function";

  return (
    <>
      {/* What is about to be sent, so nobody shares the wrong night. The
          picture's corner is the header's less its padding, so the two stay
          concentric at every radius. */}
      <div className="mb-1 flex items-center gap-3 rounded-sm bg-accent p-2">
        {image ? (
          <span className="relative size-11 shrink-0 overflow-hidden rounded-[calc(var(--radius-sm)-0.5rem)] bg-muted">
            <Image src={image} alt="" fill sizes="44px" className="object-cover" />
          </span>
        ) : null}
        <span className={cn("flex min-w-0 flex-col", !image && "px-1")}>
          <span className="truncate text-sm font-medium">{title}</span>
          {meta ? <span className="truncate text-sm text-muted-foreground">{meta}</span> : null}
        </span>
      </div>

      <Menu.Item className={ROW} onClick={() => onCopy(link)}>
        <HugeiconsIcon icon={Copy01Icon} size={18} strokeWidth={1.5} aria-hidden="true" />
        Copy link
      </Menu.Item>

      <Menu.Separator className="mx-3 my-1 h-px bg-border" />

      {PLACES.map((place) => (
        <Menu.LinkItem
          key={place.name}
          label={place.name}
          closeOnClick
          href={place.href(link, line)}
          // A network opens beside the page, and says so before it does.
          {...(place.app
            ? {}
            : { target: "_blank", rel: "noopener noreferrer", "aria-label": `${place.name}, opens in a new tab` })}
          className={ROW}
        >
          <HugeiconsIcon icon={place.icon} size={18} strokeWidth={1.5} aria-hidden="true" />
          {place.name}
        </Menu.LinkItem>
      ))}

      {sheet ? (
        <>
          <Menu.Separator className="mx-3 my-1 h-px bg-border" />
          <Menu.Item
            className={ROW}
            onClick={() => void navigator.share({ title, text: line, url: link }).catch(() => {})}
          >
            <HugeiconsIcon icon={MoreHorizontalIcon} size={18} strokeWidth={1.5} aria-hidden="true" />
            More options
          </Menu.Item>
        </>
      ) : null}
    </>
  );
}

export { ShareMenu, type ShareMenuProps };

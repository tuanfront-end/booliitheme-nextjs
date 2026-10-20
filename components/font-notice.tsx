import { TextFontIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CopyCommand } from "@/components/copy-command";
import { missingFetchedFaces } from "@/lib/fetched-fonts.mjs";

// The one instruction in this template that a buyer has to act on, put where
// they already are rather than in a documentation file they will not open.
//
// It renders in development only, so it is never a nag pointed at their
// visitors — and it disappears on its own the moment the files land, which is
// what makes it safe to be this prominent. Nothing has to be dismissed and
// nothing has to be deleted afterwards.
//
// A server component, so the check is a directory read on the machine that
// already has the answer: no request, no client bundle, no flash of a notice
// that turns out to be wrong.
export async function FontNotice() {
  if (process.env.NODE_ENV !== "development") return null;

  const missing = missingFetchedFaces();
  if (missing.length === 0) return null;

  return (
    // Bottom right, because bottom left is where Next draws its own dev
    // indicator and the two would sit on top of each other — and above the
    // preset panel's button, which holds the corner itself.
    // physical: Next's indicator holds bottom left in either direction.
    <div className="fixed right-6 bottom-24 z-50 w-[min(92vw,24rem)] rounded-lg bg-card p-5 shadow-soft-lg">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={TextFontIcon}
          size={16}
          strokeWidth={2}
          className="text-muted-foreground"
        />
        <p className="text-sm font-medium">
          {missing.length} {missing.length === 1 ? "font" : "fonts"} to download
        </p>
      </div>

      {/* The names change with every project's fontshare.css, so they sit
          apart from the sentences: a paragraph wrapped around them can only
          be fitted to this card for one list, and on the next it ends on a
          stub. */}
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {missing.map((face) => (
          <li
            key={face.file}
            className="rounded-control bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
          >
            {face.family}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-sm text-muted-foreground">
        Fontshare&apos;s faces are free to use and not free to pass on, so this
        template links to them instead of shipping them, and runs on fallbacks
        until you fetch your own.
      </p>

      <CopyCommand command="npm run fonts" />

      <p className="mt-3 text-sm text-muted-foreground">
        Development only, so your visitors never see it. Why, and which open
        face stands in for each one meanwhile: public/fonts/README.md
      </p>
    </div>
  );
}

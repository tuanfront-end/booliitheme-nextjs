import { Column } from "@/components/site/column";
import { EmailLine } from "@/components/site/email-line";
import { LogoMark } from "@/components/site/logo-mark";

// Who we are, in the fewest words that say it: the mark where a face would be,
// a greeting, one line of what we do, and where to write.
export function Intro() {
  return (
    <Column as="section" aria-labelledby="intro-title" className="pt-20 sm:pt-28">
      {/* The mark's tile, scaled past the disc, so the circle crops it the
          way an avatar crops a photograph. */}
      <span className="block size-12 overflow-hidden rounded-full">
        <LogoMark className="size-full scale-[1.3]" />
      </span>
      <h1 id="intro-title" className="mt-8 text-3xl tracking-tight sm:text-4xl sm:tracking-tighter">
        Hi, we’re BooliiTheme
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Two designers making website templates, drafted with AI and finished by hand.
      </p>
      <EmailLine className="mt-6 -mb-2" />
    </Column>
  );
}

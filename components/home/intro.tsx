import { Column } from "@/components/site/column";
import { EmailLine } from "@/components/site/email-line";
import { LogoMark } from "@/components/site/logo-mark";

// Who I am, in the fewest words that say it: the mark where a face would be,
// a greeting, one line of what I do, and where to write.
export function Intro() {
  return (
    <Column as="section" aria-labelledby="intro-title" className="pt-20 sm:pt-28">
      {/* The mark's tile, scaled past the disc, so the circle crops it the
          way an avatar crops a photograph. */}
      <span className="block size-12 overflow-hidden rounded-full">
        <LogoMark className="size-full scale-[1.3]" />
      </span>
      {/* A step over the section headings at every width — 36, 48, 60 —
          since the page opens on it. */}
      <h1 id="intro-title" className="mt-8 text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
        Hi, I’m Tuan
      </h1>
      <p className="mt-4 max-w-3xl text-base text-muted-foreground">
        I design and build website templates as BooliiTheme, drafted with AI agents and finished by hand.
      </p>
      <EmailLine className="mt-6 -mb-2" />
    </Column>
  );
}

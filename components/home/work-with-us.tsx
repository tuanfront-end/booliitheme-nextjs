"use client";

import { useState, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, PaintBoardIcon } from "@hugeicons/core-free-icons";

import { CopyEmail } from "@/components/site/copy-email";
import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { TextField } from "@/components/ui/text-field";
import { email } from "@/lib/nav";

const TOPICS = [
  { value: "own", label: "Template", subject: "A template of our own" },
  { value: "hire", label: "Website", subject: "A website for our team" },
];

const offers = [
  {
    topic: "own",
    icon: PaintBoardIcon,
    title: "Your own template",
    line: "Tell us the niche; we design a template that is yours alone.",
    action: "Ask for one",
  },
  {
    topic: "hire",
    icon: Briefcase01Icon,
    title: "Hire the studio",
    line: "We design and build your site, brief to launch, on the stack we ship.",
    action: "Tell us the project",
  },
];

// The last two of the five answers: have one of your own, or have us build
// yours. Both offers and the note to us sit in one hairline panel; an offer's
// button picks its topic in the note. Sending composes an email — there is no
// backend behind this page.
export function WorkWithUs() {
  const [topic, setTopic] = useState("own");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function send(e: FormEvent) {
    e.preventDefault();
    const subject = TOPICS.find((t) => t.value === topic)?.subject ?? "";
    const body = `${message}\n\n— ${name}`.trim();
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function pick(next: string) {
    setTopic(next);
    document.getElementById("contact-message")?.focus();
  }

  return (
    <section id="work-with-us" aria-labelledby="work-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <Eyebrow>Work with us</Eyebrow>
      <SectionHeading id="work-title" className="mt-4">
        Want one of your own?
      </SectionHeading>
      <Lede className="mt-2">Ask for a template that is only yours, or have the two of us build your site.</Lede>

      <div className="mt-16 grid overflow-hidden rounded-lg border border-border md:grid-cols-2 lg:mt-24">
        <div className="flex flex-col border-b border-border md:border-e md:border-b-0">
        {offers.map((o) => (
          <div key={o.topic} className="flex flex-1 flex-col border-b border-border p-6 last:border-b-0 sm:p-8 lg:p-10">
            <HugeiconsIcon icon={o.icon} size={20} strokeWidth={1.5} className="text-brand" />
            <h3 className="mt-6 text-sm">{o.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{o.line}</p>
            <div className="mt-auto pt-8">
              <Button variant="secondary" onClick={() => pick(o.topic)}>
                {o.action}
              </Button>
            </div>
          </div>
        ))}
        </div>

        <form id="contact" onSubmit={send} className="flex flex-col gap-5 bg-muted p-6 sm:p-8 lg:p-10">
          <Segmented aria-label="What it is about" name="topic" value={topic} onValueChange={setTopic} options={TOPICS} fill />
          <TextField label="Your name" name="name" autoComplete="name" value={name} onValueChange={setName} required />
          <TextField
            id="contact-message"
            label="What you have in mind"
            name="message"
            multiline
            rows={4}
            value={message}
            onValueChange={setMessage}
            hint="We answer within two working days."
            required
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CopyEmail email={email} className="-mx-3" />
            <Button type="submit">Write the email</Button>
          </div>
        </form>
      </div>
    </section>
  );
}

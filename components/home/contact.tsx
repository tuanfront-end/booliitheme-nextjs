// ref: contact-sections/reserve-form-left-render-and-a-contact-card-right.webp — split 58/42 · left-heavy (departed: a topic row and a message box in the form, where the reference asks a name and an email; the render slot holds the studio mark)
// opens: panel · light
"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Mail01Icon, MailSend01Icon, Store01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, type FormEvent } from "react";

import { CopyEmail } from "@/components/site/copy-email";
import { Eyebrow } from "@/components/site/eyebrow";
import { Lede } from "@/components/site/lede";
import { LogoMark } from "@/components/site/logo-mark";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import {
  Select,
  SelectContent,
  SelectFieldLabel,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { author, projects } from "@/lib/data/projects";
import { email, socials } from "@/lib/nav";

const topics = [
  { value: "pre-sale", label: "Pre-sale question", prompt: "Which template, which platform, and what you want to know" },
  { value: "support", label: "Support", prompt: "What you did, what you expected, and what happened instead" },
  { value: "custom", label: "Custom work", prompt: "The template, the change you need, and when you need it" },
];

const NONE = "none";
const templateItems = [
  { value: NONE, label: "Not about one template" },
  ...projects.map((p) => ({ value: p.slug, label: p.name })),
];

/** The message as the mail app opens it: the topic and the template in the
 *  subject, the template named again over the words so a reply can quote it. */
function mailto(topic: string, slug: string, message: string) {
  const t = topics.find((x) => x.value === topic)!;
  const p = projects.find((x) => x.slug === slug);
  const subject = p ? `${t.label} · ${p.name}` : t.label;
  const body = p ? `Template: ${p.name}\n\n${message}` : message;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// The last section before the footer, so it carries no band. A tinted form
// panel on the reading side; on the other, the studio mark on its own tile and
// a card with the address, the marketplace profile and the social links. The
// form sends nothing: it composes a mailto: and hands it to the visitor's mail
// app. Support for a purchase belongs on the item page, and the note under the
// button links to the picked template's.
export function Contact() {
  const [topic, setTopic] = useState(topics[0].value);
  const [slug, setSlug] = useState<string>(NONE);
  const [message, setMessage] = useState("");
  const [missing, setMissing] = useState(false);

  const picked = projects.find((p) => p.slug === slug);
  const prompt = topics.find((t) => t.value === topic)!.prompt;

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) {
      setMissing(true);
      return;
    }
    window.location.href = mailto(topic, slug, message.trim());
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col justify-center rounded-lg bg-accent px-6 py-10 sm:px-10 sm:py-14 lg:col-span-7 lg:px-14 lg:py-16">
          <Eyebrow>Contact</Eyebrow>
          <SectionHeading id="contact-title" className="mt-4 max-w-lg">
            Write to the people who build the templates
          </SectionHeading>
          <Lede className="mt-5 max-w-lg">
            Ask about a template before you buy, or tell us what you want built. We open the message in your mail app,
            ready to send.
          </Lede>

          <form onSubmit={send} noValidate className="mt-10 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span id="contact-topic" className="text-sm font-medium">
                Topic
              </span>
              <Segmented
                variant="brand"
                name="topic"
                aria-labelledby="contact-topic"
                options={topics.map(({ value, label }) => ({ value, label }))}
                value={topic}
                onValueChange={setTopic}
              />
            </div>

            <Select items={templateItems} value={slug} onValueChange={(v) => setSlug(String(v ?? NONE))}>
              <div className="flex flex-col gap-2 sm:max-w-xs">
                <SelectFieldLabel>Template</SelectFieldLabel>
                <SelectTrigger size="field" className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </div>
              <SelectContent label="Template">
                <SelectGroup>
                  <SelectLabel>Template</SelectLabel>
                  {templateItems.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <TextField
              label="Message"
              name="message"
              multiline
              rows={4}
              placeholder={prompt}
              value={message}
              onValueChange={(v) => {
                setMessage(String(v));
                if (missing && String(v).trim()) setMissing(false);
              }}
              error={missing ? "Write a line first" : undefined}
            />

            <div className="flex flex-col gap-4">
              <Button type="submit" size="lg" className="self-start">
                <HugeiconsIcon icon={MailSend01Icon} strokeWidth={1.5} data-icon="inline-start" />
                Open in your mail app
              </Button>
              <p className="max-w-md text-sm text-muted-foreground">
                Your mail app sends it; this page keeps nothing. Support for a template you bought runs on{" "}
                {picked ? (
                  <a
                    href={picked.market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xs font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {picked.name}&apos;s item page
                    <span className="sr-only"> on ThemeForest (opens in a new tab)</span>
                  </a>
                ) : (
                  "its ThemeForest item page"
                )}
                .
              </p>
            </div>
          </form>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:grid-rows-[1fr_auto]">
          <div className="grid min-h-64 place-items-center rounded-lg bg-muted p-10">
            <LogoMark className="size-40 sm:size-48 lg:size-56" />
          </div>

          <div className="rounded-lg bg-accent p-5 sm:p-8">
            <h3 className="font-heading text-2xl font-medium tracking-tight">Or write from your own app</h3>
            <p className="mt-2 text-muted-foreground">Copy the address, or find us where we post each release.</p>
            <ul className="mt-6 flex flex-col gap-3">
              <li className="flex items-center gap-4">
                <IconDisc icon={Mail01Icon} />
                <CopyEmail email={email} className="-ms-4" />
              </li>
              <li className="flex items-center gap-4">
                <IconDisc icon={Store01Icon} />
                <Button
                  variant="link"
                  render={<a href={author.url} target="_blank" rel="noopener noreferrer" />}
                  nativeButton={false}
                >
                  ThemeForest profile
                  <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="rtl:-scale-x-100" />
                  <span className="sr-only">(opens in a new tab)</span>
                </Button>
              </li>
              <li className="flex items-center gap-4">
                <IconDisc icon={UserGroupIcon} />
                <span className="flex flex-wrap gap-x-5">
                  {socials.map((s) => (
                    <Button
                      key={s.label}
                      variant="link"
                      render={<a href={s.href} target="_blank" rel="noopener noreferrer" />}
                      nativeButton={false}
                    >
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </Button>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function IconDisc({ icon }: { icon: typeof Mail01Icon }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-foreground">
      <HugeiconsIcon icon={icon} size={18} strokeWidth={1.5} aria-hidden="true" />
    </span>
  );
}

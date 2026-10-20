// ref: none — panel 25/75 · left-rail (free rein, design-refs has no application-panel folder; Application UI sits outside the Tailwind Plus page-section set this kit indexes)
"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  CreditCardIcon,
  PlugSocketIcon,
  Search01Icon,
  Settings01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { Eyebrow } from "@/components/site/eyebrow";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "General", icon: Settings01Icon },
  { label: "Members", icon: UserGroupIcon, active: true },
  { label: "Billing", icon: CreditCardIcon },
  { label: "Integrations", icon: PlugSocketIcon },
  { label: "Audit log", icon: Clock01Icon },
];

const members = [
  {
    name: "Hoang Minh Tu",
    email: "tu@northwind.co",
    role: "Owner",
    seen: "2 min ago",
    status: "Active",
  },
  {
    name: "Priya Raghunathan",
    email: "priya@northwind.co",
    role: "Admin",
    seen: "1 hr ago",
    status: "Active",
  },
  {
    name: "Samuel Okonkwo",
    email: "samuel@northwind.co",
    role: "Editor",
    seen: "3 days ago",
    status: "Idle",
  },
  {
    name: "Lena Vogt",
    email: "lena@northwind.co",
    role: "Editor",
    seen: "2 weeks ago",
    status: "Idle",
  },
  {
    name: "Diego Marchetti",
    email: "diego@northwind.co",
    role: "Viewer",
    seen: "never",
    status: "Invited",
  },
];

// A tint of a mid-saturation hue rather than a solid -200 block, with ink from
// the same hue. The chip reads without spending the page's colour budget.
const statusTone = {
  Active: "bg-leaf/15 text-leaf-ink",
  Idle: "bg-sun/15 text-sun-ink",
  Invited: "bg-iris/15 text-iris-ink",
} as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export function TeamPanel() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-24">
      <div className="flex gap-6">
        {/* The rail is the softest tint on the ladder, not the darkest. */}
        <nav className="hidden w-56 shrink-0 rounded-lg bg-accent p-3 md:block">
          <Eyebrow className="px-3 pt-2 pb-4">
            Northwind
          </Eyebrow>
          <ul className="space-y-1.5">
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  aria-current={item.active ? "page" : undefined}
                  className={`flex h-9 items-center gap-3 rounded-control px-3 text-sm ${reach} ${
                    item.active
                      ? "bg-card font-medium shadow-soft"
                      : "text-muted-foreground transition-colors hover:text-foreground"
                  }`}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={18}
                    strokeWidth={1.5}
                    className="shrink-0"
                  />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1 rounded-lg border bg-card">
          <div className="flex flex-wrap items-center gap-4 p-6">
            <div className="me-auto">
              <h2 className="text-xl tracking-tight">Members</h2>
              <p className="text-sm text-muted-foreground">
                5 of 10 seats used on the Studio plan.
              </p>
            </div>

            {/* A label rather than a div, because the reach layer paints over
                the field and the click has to land on something that focuses
                it. The input is lifted back above the layer so the caret and
                drag-select still work inside the field — sinking the layer
                instead would put it behind the card's own background. */}
            <label
              className={`flex h-9 items-center gap-2 rounded-control bg-accent px-3.5 ${reach}`}
            >
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                strokeWidth={1.5}
                className="shrink-0 text-muted-foreground"
              />
              <input
                type="search"
                placeholder="Search members"
                aria-label="Search members"
                className="relative z-10 w-40 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </label>

            <Button size="sm" className={reach}>
              Invite people
            </Button>
          </div>

          {/* Rows sit on the card colour; a hairline divides them. Striping
              would spend the one tint step and strand the chips inside a row. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-y bg-accent text-start">
                  <th className="px-6 py-2.5 font-medium">Member</th>
                  <th className="px-6 py-2.5 font-medium">Role</th>
                  <th className="px-6 py-2.5 font-medium">Last active</th>
                  <th className="px-6 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, i) => (
                  <tr key={member.email} className={i ? "border-t" : ""}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-muted-foreground">
                          {initials(member.name)}
                        </span>
                        <span>
                          <span className="block font-medium">
                            {member.name}
                          </span>
                          {/* A meta line under the name, at the row's 14:
                              read, not recognised, so never a caption. */}
                          <span className="block text-muted-foreground">
                            {member.email}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-control bg-foreground/6 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 tabular-nums text-muted-foreground">
                      {member.seen}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`rounded-control px-2.5 py-1 text-xs font-medium ${statusTone[member.status as keyof typeof statusTone]}`}
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

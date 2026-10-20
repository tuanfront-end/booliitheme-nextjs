// ref: none — n/a (demo-only: the preset panel's buy link; packaging deletes this folder)
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { buttonVariants } from "@/components/ui/button";

// The lead segment of the preset panel's button, on the direct-sale demo only:
// the deployment that sets NEXT_PUBLIC_POLAR_CHECKOUT_URL. The marketplace
// demos leave it unset, since their own page carries the buy button, and so
// does every copy a buyer builds — packaging deletes this folder before the zip.
export function DemoBuyLink() {
  const checkout = process.env.NEXT_PUBLIC_POLAR_CHECKOUT_URL;
  if (!checkout) return null;
  const href = new URL(checkout);
  href.searchParams.set("utm_source", "live-demo");

  return (
    <a href={href.toString()} className={buttonVariants()}>
      <span className="sm:hidden">Buy</span>
      <span className="max-sm:hidden">Get the template</span>
      <ArrowUpRightIcon aria-hidden data-icon="inline-end" className="rtl:-scale-x-100" />
    </a>
  );
}

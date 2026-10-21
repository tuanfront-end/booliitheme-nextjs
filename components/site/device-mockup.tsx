import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

type DeviceMockupProps = {
  desktop: StaticImageData;
  mobile: StaticImageData;
  /** What the two screens show, said once for both. */
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

// A laptop and a phone drawn in hairlines, each showing a live capture of the
// same site: the laptop open at the back, the phone standing in front of its
// lower corner. The phone floats over the laptop, so it alone carries the
// floating shadow.
export function DeviceMockup({ desktop, mobile, alt, sizes = "40rem", priority, className }: DeviceMockupProps) {
  return (
    <div className={cn("relative aspect-[16/11] w-full", className)}>
      <div className="absolute inset-x-[4%] top-[4%] flex flex-col items-center">
        <div className="w-[88%] rounded-t-[10px] border border-border bg-background p-[1.2%] pb-[1.6%]">
          <div className="overflow-hidden rounded-[4px] border border-border">
            <Image
              src={desktop}
              alt={alt}
              sizes={sizes}
              priority={priority}
              className="aspect-[16/10] w-full object-cover object-top"
            />
          </div>
        </div>
        {/* The base: a hairline slab a little wider than the lid, a notch in its edge. */}
        <div className="relative h-[3.2%] min-h-2 w-full rounded-b-[10px] border border-t-0 border-border bg-muted">
          <span className="absolute inset-x-[44%] top-0 h-1/2 rounded-b-[4px] border border-t-0 border-border" />
        </div>
      </div>

      <div className="absolute end-[3%] bottom-[7%] w-[17%] rounded-[14px] border border-border bg-background p-[3px] shadow-soft-lg">
        <div className="relative overflow-hidden rounded-[11px] border border-border">
          <Image
            src={mobile}
            alt=""
            sizes="12rem"
            priority={priority}
            className="aspect-[9/19.5] w-full object-cover object-top"
          />
          <span className="absolute start-1/2 top-[1.2%] h-[1.8%] w-[24%] -translate-x-1/2 rounded-full bg-foreground rtl:translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}

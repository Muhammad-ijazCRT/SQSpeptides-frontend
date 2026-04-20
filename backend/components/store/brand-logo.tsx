import Image from "next/image";

/** Public asset — keep in sync with `public/logo.png`. */
export const SITE_LOGO_SRC = "/logo.png" as const;

type BrandLogoProps = {
  className?: string;
  /** Target height in CSS pixels; width follows aspect ratio. */
  height?: number;
  /** Pass true on the home hero for faster LCP. */
  priority?: boolean;
};

export function BrandLogo({ className = "", height = 40, priority = false }: BrandLogoProps) {
  return (
    <Image
      src={SITE_LOGO_SRC}
      alt="SQSpeptides"
      width={480}
      height={120}
      priority={priority}
      unoptimized
      className={`w-auto max-w-[min(100%,20rem)] object-contain object-left ${className}`.trim()}
      style={{ height: `${height}px`, width: "auto" }}
    />
  );
}

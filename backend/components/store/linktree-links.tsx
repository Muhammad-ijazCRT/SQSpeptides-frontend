import { SQSPEPTIDES_LINKTREE } from "@/lib/store/social-links";
import { LinktreeIcon } from "@/components/store/linktree-icon";

export function LinktreeLinks({ variant }: { variant: "footer" | "contact" }) {
  const isFooter = variant === "footer";
  return (
    <ul className={isFooter ? "mt-4 flex flex-col gap-3" : "mt-4 space-y-3"}>
      {SQSPEPTIDES_LINKTREE.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isFooter
                ? "group inline-flex items-center gap-2.5 text-sm text-white/75 transition hover:text-[#D4AF37]"
                : "group inline-flex items-center gap-2.5 font-medium text-neutral-900 transition hover:text-[#b8962e]"
            }
          >
            <span
              className={
                isFooter
                  ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#39E09B] ring-1 ring-white/15 transition group-hover:bg-white/15 group-hover:text-[#5ef0b3]"
                  : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#39E09B]/15 text-[#1fa97a] ring-1 ring-[#39E09B]/30 transition group-hover:bg-[#39E09B]/25"
              }
              aria-hidden
            >
              <LinktreeIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block leading-tight">{item.label}</span>
              <span
                className={
                  isFooter ? "block text-xs text-white/50 group-hover:text-white/70" : "block text-xs text-neutral-500"
                }
              >
                {item.description}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

import type { ReactNode } from "react";
import {
  IconBrandMark,
  IconChat,
  IconFolder,
  IconHouse,
} from "@/components/home/mock-icons";

const BRAND = "BrandMages";

/**
 * A client portal's sidebar at the top of the guide card: the BrandMages logo
 * and name, Home open, then Messages and Files.
 * Uses the homepage mocks' brand mark and product glyphs so it reads as the
 * real portal. Decorative: the card's copy says the same thing in words.
 */
export function PostCtaVisual() {
  const apps: { icon: ReactNode; label: string; active?: boolean }[] = [
    { icon: <IconHouse className="size-full" />, label: "Home", active: true },
    { icon: <IconChat className="size-full" />, label: "Messages" },
    { icon: <IconFolder className="size-full" />, label: "Files" },
  ];
  return (
    <div
      aria-hidden
      className="flex w-full cursor-default select-none flex-col gap-0.5 overflow-hidden rounded-lg bg-[#f5f5f5] px-2.5 py-3 text-[#101114] [[data-theme=dark]_&]:bg-[#262626] [[data-theme=dark]_&]:text-white"
    >
      <div className="mb-2 flex items-center gap-2 px-1.5">
        <span className="flex size-[18px] shrink-0 items-center justify-center rounded bg-[#101114] text-white [[data-theme=dark]_&]:bg-[#dcdcdc] [[data-theme=dark]_&]:text-[#101114]">
          <IconBrandMark className="size-[11px]" />
        </span>
        <span className="truncate text-xs">{BRAND}</span>
      </div>
      {apps.map((app) => (
        <div
          key={app.label}
          className={`flex items-center gap-2 rounded-md px-1.5 py-1 ${app.active ? "bg-black/[0.06] [[data-theme=dark]_&]:bg-white/10" : "text-[#101114]/60 [[data-theme=dark]_&]:text-white/70"}`}
        >
          <span className="flex size-[18px] shrink-0 items-center justify-center">
            <span className="size-3">{app.icon}</span>
          </span>
          <span className="truncate text-[11px] leading-4">{app.label}</span>
        </div>
      ))}
    </div>
  );
}

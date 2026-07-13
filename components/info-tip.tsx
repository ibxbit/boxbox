import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

// Pure-CSS hover/focus tooltip — a small "i" that explains F1 jargon.
export function InfoTip({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("group/tip relative inline-flex align-middle", className)} tabIndex={0}>
      <Info className="size-4 cursor-help text-muted-foreground/70 transition-colors group-hover/tip:text-foreground group-focus-within/tip:text-foreground" />
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border bg-popover p-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-popover-foreground opacity-0 shadow-xl transition-all duration-200 group-hover/tip:visible group-hover/tip:opacity-100 group-focus-within/tip:visible group-focus-within/tip:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "danger" | "warning";
}

function Badge({ className, variant = "secondary", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border rounded-none",
        variant === "primary" &&
          "bg-primary/10 border-primary text-primary",
        variant === "secondary" &&
          "bg-zinc-950 border-zinc-800 text-text-muted",
        variant === "danger" &&
          "bg-error/10 border-error text-error",
        variant === "warning" &&
          "bg-tertiary/10 border-tertiary text-tertiary",
        className
      )}
      {...props}
    />
  );
}

export { Badge };

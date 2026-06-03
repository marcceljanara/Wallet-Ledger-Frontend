import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider border transition-colors focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:opacity-50 disabled:pointer-events-none rounded-none",
          // Variants
          variant === "primary" &&
            "bg-primary border-primary text-on-primary hover:bg-primary/90 hover:border-primary/90",
          variant === "secondary" &&
            "bg-transparent border-zinc-700 text-foreground hover:bg-zinc-900/50 hover:border-zinc-600",
          variant === "danger" &&
            "bg-error border-error text-on-error hover:bg-error/90 hover:border-error/90",
          variant === "ghost" &&
            "bg-transparent border-transparent hover:bg-zinc-900/50 text-foreground",
          // Sizes
          size === "sm" && "px-3 py-1 text-[10px]",
          size === "md" && "px-4 py-2",
          size === "lg" && "px-6 py-3 text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

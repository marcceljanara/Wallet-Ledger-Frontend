import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            "flex w-full bg-black border border-zinc-800 px-3 py-2 text-sm font-sans text-foreground rounded-none transition-colors placeholder:text-zinc-600 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

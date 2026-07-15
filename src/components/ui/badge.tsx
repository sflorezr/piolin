import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "neutral" && "bg-neutral-100 text-neutral-600",
        variant === "default" && "bg-neutral-900 text-white",
        className
      )}
      {...props}
    />
  );
}

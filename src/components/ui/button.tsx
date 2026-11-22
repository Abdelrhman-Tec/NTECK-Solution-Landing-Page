import type { ComponentProps } from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  outline: "border border-input bg-transparent text-foreground hover:bg-muted",
};

type ButtonProps = ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: keyof typeof variants;
};

export function Button({
  asChild = false,
  variant = "primary",
  className,
  type,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

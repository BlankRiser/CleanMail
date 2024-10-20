"use client"

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        none: "",
        default:
          "bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-700 active:bg-neutral-800",
        secondary:
          "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 active:bg-neutral-200/80 ",
        outline:
          "border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 hover:border-transparent",
        ghost: "hover:bg-neutral-100 hover:text-neutral-900",
        link: "text-neutral-900 underline underline-offset-4 hover:text-indigo-600 dark:text-neutral-50",
        destructive:
          "bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90 active:bg-red-600 dark:bg-red-900",
        cta: "border border-transparent text-neutral-900 [background:linear-gradient(#fafafa,#fafafa)_padding-box,linear-gradient(to_top,#e0e7ff,#818cf8)_border-box] hover:[background:linear-gradient(#f5f5f5,#f5f5f5)_padding-box,linear-gradient(to_top,#c7d2fe,#818cf8)_border-box] active:[background:linear-gradient(#e5e5e5,#e5e5e5)_padding-box,linear-gradient(to_top,#c7d2fe,#818cf8)_border-box]",
      },
      size: {
        xs: "h-6 min-w-6 gap-1 px-1 text-xs [&>svg]:size-3",
        sm: "h-8 min-w-8 gap-2 px-2 text-sm [&>svg]:size-3",
        md: "h-9 min-w-9 gap-2 px-3 text-base [&>svg]:size-3",
        lg: "h-10 min-w-10 gap-2 px-3 text-base [&>svg]:size-3",
        xl: "h-12 min-w-12 gap-2 px-5 text-base [&>svg]:size-3",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      rounded = "md",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp ref={ref} {...props}>
        <>
          {isLoading && (
            <span
              className={cn([
                isLoading ? "visible" : "invisible",
                "inline-flex items-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ",
              ])}
            >
              <Spinner /> Loading
            </span>
          )}
          <div
            className={cn(
              buttonVariants({ variant, size, rounded, className })
            )}
          >
            {children}
          </div>
        </>
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none",
      className
    )}
    {...props}
  >
    {children}
  </button>
));

Button.displayName = "Button";

export { Button };

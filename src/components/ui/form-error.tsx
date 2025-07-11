import * as React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function FormError({
  className,
  children,
  message,
  ...props
}: FormErrorProps) {
  if (!message && !children) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-destructive mt-2",
        className
      )}
      {...props}
      role="alert"
    >
      <ExclamationTriangleIcon className="h-4 w-4" />
      <span>{message || children}</span>
    </div>
  );
}

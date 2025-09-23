/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm",
                    "shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

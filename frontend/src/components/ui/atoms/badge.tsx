import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: Variant;
}

const styles: Record<Variant, string> = {
    default:
        "border-transparent bg-primary text-primary-foreground",
    secondary:
        "border-transparent bg-secondary text-secondary-foreground",
    destructive:
        "border-transparent bg-destructive text-destructive-foreground",
    outline:
        "border-foreground/20 text-foreground border",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                "border transition-colors",
                styles[variant],
                className
            )}
            {...props}
        />
    );
}

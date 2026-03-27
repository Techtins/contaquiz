"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

type Tone = "default" | "info" | "success" | "warning" | "destructive";

type HintProps = {
    /** Texto do tooltip */
    label: React.ReactNode;
    /** Posição (Radix) */
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    /** Aparência pastel */
    tone?: Tone;
    /** Atraso em ms */
    delayDuration?: number;
    /** Qualquer filho clicável/hoverável */
    children: React.ReactNode;
    className?: string;
};

const toneRing: Record<Tone, string> = {
    default: "ring-border",
    info: "ring-primary/40",
    success: "ring-secondary/40",
    warning: "ring-warning/40",
    destructive: "ring-destructive/40",
};

const toneDot: Record<Tone, string> = {
    default: "bg-foreground/20",
    info: "bg-primary",
    success: "bg-secondary",
    warning: "bg-warning",
    destructive: "bg-destructive",
};

/** Tooltip pronto para uso */
export function Hint({
                         label,
                         side = "top",
                         align = "center",
                         tone = "default",
                         delayDuration = 150,
                         children,
                         className,
                     }: HintProps) {
    return (
        <TooltipPrimitive.Provider delayDuration={delayDuration}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        align={align}
                        sideOffset={8}
                        className={cn(
                            "z-50 rounded-md border border-border bg-popover px-3 py-2 text-sm text-foreground shadow-lg",
                            "ring-1", toneRing[tone],
                            // animações
                            "data-[state=open]:animate-in data-[state=closed]:animate-out",
                            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                            "data-[side=bottom]:slide-in-from-top-2",
                            "data-[side=top]:slide-in-from-bottom-2",
                            "data-[side=left]:slide-in-from-right-2",
                            "data-[side=right]:slide-in-from-left-2",
                            className
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2 rounded-full", toneDot[tone])} />
                            <span>{label}</span>
                        </div>
                        <TooltipPrimitive.Arrow className="fill-popover" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}

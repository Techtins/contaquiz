"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "destructive";
type Toast = {
    id: string;
    title?: string;
    description?: string;
    variant: Variant;
    duration: number;
};

export function Toaster() {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    React.useEffect(() => {
        const handler = (e: Event) => {
            const { detail } = e as CustomEvent;
            const id = crypto.randomUUID();
            const t: Toast = {
                id,
                title: detail?.title,
                description: detail?.description,
                variant: detail?.variant ?? "default",
                duration: typeof detail?.duration === "number" ? detail.duration : 3000,
            };
            setToasts((prev) => [...prev, t]);
            // auto close
            setTimeout(() => {
                setToasts((prev) => prev.filter((x) => x.id !== id));
            }, t.duration);
        };
        window.addEventListener("app:toast", handler);
        return () => window.removeEventListener("app:toast", handler);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end gap-2 p-4">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={cn(
                        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border p-4 shadow-lg",
                        "bg-background text-foreground",
                        t.variant === "destructive" &&
                        "border-destructive/30 bg-destructive text-destructive-foreground"
                    )}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            {t.title && <div className="font-semibold">{t.title}</div>}
                            {t.description && (
                                <div className="text-sm opacity-90">{t.description}</div>
                            )}
                        </div>
                        <button
                            aria-label="Fechar"
                            onClick={() =>
                                setToasts((prev) => prev.filter((x) => x.id !== t.id))
                            }
                            className={cn(
                                "rounded p-1 opacity-70 transition hover:opacity-100",
                                t.variant === "destructive" && "hover:bg-destructive/20"
                            )}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

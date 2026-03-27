"use client";

type Variant = "default" | "destructive";

export type ToastInput = {
    title?: string;
    description?: string;
    variant?: Variant;
    duration?: number; // ms (default 3000)
};

export function useToast() {
    function toast(options: ToastInput) {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent("app:toast", { detail: options }));
    }
    return { toast };
}

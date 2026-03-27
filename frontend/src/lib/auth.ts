"use client"

export const AUTH_TOKEN_KEY = "contaquiz-token"
export const AUTH_SESSION_STORAGE_KEY = "contaquiz-auth-session"

export type AuthSession = {
    _id: string
    name: string
    email: string
    role: "admin" | "student"
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null
    return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setToken(token: string) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthSession(): AuthSession | null {
    if (typeof window === "undefined") return null

    try {
        const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)
        return raw ? (JSON.parse(raw) as AuthSession) : null
    } catch {
        return null
    }
}

export function setAuthSession(session: AuthSession) {
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
    window.sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearAuthSession() {
    if (typeof window === "undefined") return

    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

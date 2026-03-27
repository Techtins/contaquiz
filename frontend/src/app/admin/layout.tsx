"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/atoms/button"
import { BookOpen, Users, FileQuestion, Trophy, BarChart3, Settings, Menu, X, Home, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Disciplinas", href: "/admin/disciplinas", icon: BookOpen },
    { name: "Tópicos", href: "/admin/topicos", icon: Settings },
    { name: "Questões", href: "/admin/questoes", icon: FileQuestion },
    { name: "Quizzes", href: "/admin/quizzes", icon: Trophy },
    { name: "Usuários", href: "/admin/usuarios", icon: Users },
]

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-pointer" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2 p-6 border-b border-border">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">ContaQuiz</span>
                        <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-foreground">A</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">Admin</p>
                                <p className="text-xs text-muted-foreground truncate">admin@contaquiz.com</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                            <Link href="/login">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="flex items-center gap-4 ml-auto">
                            <span className="text-sm text-muted-foreground hidden sm:block">Painel Administrativo</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    )
}

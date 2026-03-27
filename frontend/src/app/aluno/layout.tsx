"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/atoms/button"
import { BookOpen, Home, Trophy, User, Menu, X, LogOut, Play } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/useToast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/atoms/alertDialog"
import { clearAuthSession, getAuthSession } from "@/lib/auth"

const navigation = [
    { name: "Dashboard", href: "/aluno", icon: Home },
    { name: "Quizzes", href: "/aluno/quizzes", icon: Play },
    { name: "Historico", href: "/aluno/historico", icon: Trophy },
    { name: "Meu Perfil", href: "/aluno/perfil", icon: User },
]

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const pathname = usePathname()
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const session = getAuthSession()

        if (!session) {
            router.replace("/auth/login")
            return
        }

        setUserName(session.name)
        setUserEmail(session.email)
        setIsCheckingAuth(false)
    }, [router])

    const handleLogout = () => {
        clearAuthSession()
        setIsLogoutDialogOpen(false)
        toast({
            title: "Voce saiu do sistema com sucesso.",
            description: "Redirecionando para a tela de login.",
        })
        router.replace("/auth/login")
    }

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="rounded-3xl border border-white/70 bg-white/85 px-6 py-8 text-center shadow-xl shadow-slate-200/50">
                    <p className="text-sm font-medium text-foreground">Verificando sessao...</p>
                    <p className="mt-2 text-sm text-muted-foreground">Protegendo o acesso as telas internas.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-pointer" onClick={() => setSidebarOpen(false)} />
            )}

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 p-6 border-b border-border">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">ContaQuiz</span>
                        <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

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

                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-foreground">{userName.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => setIsLogoutDialogOpen(true)}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </div>
            </div>

            <div className="lg:pl-64">
                <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-4 ml-auto">
                            <span className="text-sm text-muted-foreground hidden sm:block">Area do Aluno</span>
                            <Button variant="outline" size="sm" className="hidden bg-transparent sm:inline-flex" onClick={() => setIsLogoutDialogOpen(true)}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6">{children}</main>
            </div>

            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza que deseja sair do sistema?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ao confirmar, a sessao atual sera encerrada e os dados locais de autenticacao serao removidos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Nao</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Sim</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Label } from "@/components/ui/atoms/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate login API call
        setTimeout(() => {
            console.log("Login attempt:", { email, password })
            // Redirect to admin dashboard after successful login
            window.location.href = "/admin"
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold text-foreground">ContaQuiz</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Área Administrativa</h1>
                    <p className="text-muted-foreground">Faça login para gerenciar a plataforma</p>
                </div>

                {/* Login Card */}
                <Card className="border-2 shadow-lg">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl">Entrar no Sistema</CardTitle>
                        <CardDescription>Digite suas credenciais para acessar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@contaquiz.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha *</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 text-base font-medium cursor-pointer" disabled={loading}>
                                {loading ? "Entrando..." : "Entrar"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                ← Voltar para o site
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Demo credentials info */}
                <Card className="mt-4 border-dashed">
                    <CardContent className="pt-4">
                        <p className="text-xs text-muted-foreground text-center">
                            <strong>Demo:</strong> admin@contaquiz.com / admin123
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Label } from "@/components/ui/atoms/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { BookOpen, Eye, EyeOff, ShieldCheck, BarChart3, Clock3 } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { setAuthSession, setToken } from "@/lib/auth"
import { loginRequest } from "@/services/modules/auth.service"
import Link from "next/link"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const platformHighlights = [
    {
        title: "Gestao segura",
        description: "Login para administracao e operacao do sistema.",
        icon: ShieldCheck,
    },
    {
        title: "Desempenho",
        description: "Leitura clara de indicadores e andamento da plataforma.",
        icon: BarChart3,
    },
    {
        title: "Agilidade",
        description: "Acesso rapido para atualizar disciplinas, topicos e questoes.",
        icon: Clock3,
    },
]

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({})

    useEffect(() => {
        if (searchParams.get("registered") === "1") {
            toast({
                title: "Cadastro realizado com sucesso!",
                description: "Agora voce pode entrar com seu e-mail e senha.",
            })
            router.replace("/auth/login")
        }
    }, [router, searchParams, toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const nextErrors: { email?: string; password?: string } = {}

        if (!email.trim()) {
            nextErrors.email = "Informe o e-mail de acesso."
        } else if (!EMAIL_REGEX.test(email.trim())) {
            nextErrors.email = "Informe um e-mail valido no formato nome@dominio.extensao."
        }

        if (!password.trim()) {
            nextErrors.password = "Informe sua senha."
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        setLoading(true)
        setErrors({})

        try {
            const { token, user } = await loginRequest({
                email: email.trim().toLowerCase(),
                password,
            })

            setToken(token)

            const role = user.systemRole === "ADMIN" ? "admin" : "student"
            setAuthSession({
                _id: user._id,
                name: user.name,
                email: user.email,
                role,
            })

            toast({
                title: "Login realizado com sucesso",
                description: role === "admin"
                    ? "Redirecionando para o painel administrativo."
                    : "Redirecionando para a tela inicial do usuario.",
            })

            router.replace(role === "admin" ? "/admin" : "/aluno")
        } catch (err: any) {
            const message = err?.response?.data?.error || "Usuario nao encontrado ou senha incorreta."
            setErrors({ auth: message })
            toast({
                title: "Falha no login",
                description: message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen px-4 py-10 md:px-6 md:py-14">
            <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="flex flex-col justify-between rounded-[32px] border border-white/60 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/40">
                    <div>
                        <Link href="/" className="mb-10 inline-flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                <BookOpen className="h-6 w-6 text-sky-300" />
                            </div>
                            <div>
                                <span className="block text-2xl font-bold">ContaQuiz</span>
                                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Painel de acesso</span>
                            </div>
                        </Link>

                        <div className="max-w-xl">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Ambiente seguro</p>
                            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
                                Entre para administrar a base de questoes e acompanhar a operacao da plataforma.
                            </h1>
                            <p className="text-lg text-slate-300">
                                Um acesso mais profissional para o ecossistema ContaQuiz, com foco em organizacao de conteudo,
                                analise de uso e preparo para o Exame de Suficiencia do CRC.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-3">
                        {platformHighlights.map(({ title, description, icon: Icon }) => (
                            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <Icon className="mb-3 h-5 w-5 text-sky-300" />
                                <p className="mb-1 font-semibold">{title}</p>
                                <p className="text-sm text-slate-300">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="w-full">
                        <Card className="border-white/70 bg-white/88 shadow-2xl shadow-slate-200/60 backdrop-blur">
                            <CardHeader className="pb-4 text-center">
                                <CardTitle className="text-2xl">Entrar no sistema</CardTitle>
                                <CardDescription>Informe seu e-mail e senha para acessar as funcionalidades do seu perfil</CardDescription>
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
                                            onChange={(e) => {
                                                setEmail(e.target.value)
                                                setErrors((prev) => ({ ...prev, email: undefined, auth: undefined }))
                                            }}
                                            required
                                            className="h-11 bg-white"
                                        />
                                        {errors.email && <p className="text-sm text-destructive-foreground">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Senha *</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Digite sua senha"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value)
                                                    setErrors((prev) => ({ ...prev, password: undefined, auth: undefined }))
                                                }}
                                                required
                                                className="h-11 bg-white pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-sm text-destructive-foreground">{errors.password}</p>}
                                    </div>

                                    {errors.auth && (
                                        <div className="rounded-2xl border border-destructive/30 bg-destructive/15 px-4 py-3 text-sm text-destructive-foreground">
                                            {errors.auth}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <Link href="/auth/register" className="font-medium text-primary transition-colors hover:text-primary/80">
                                            Fazer uma conta
                                        </Link>
                                        <Link href="/auth/forgot-password" className="text-muted-foreground transition-colors hover:text-foreground">
                                            Esqueceu a senha?
                                        </Link>
                                    </div>

                                    <Button type="submit" className="h-11 w-full text-base font-medium" disabled={loading}>
                                        {loading ? "Entrando..." : "Entrar"}
                                    </Button>
                                </form>

                                <div className="mt-6 space-y-4">
                                    <div className="rounded-2xl border border-dashed border-border bg-muted/45 p-4 text-center">
                                        <p className="text-xs text-muted-foreground">
                                            <strong>Demo admin:</strong> admin@contaquiz.com / admin123
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            <strong>Demo aluno:</strong> aluno@contaquiz.com / aluno123
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                            Voltar para a apresentacao do produto
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

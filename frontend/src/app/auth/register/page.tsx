"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft,
    BookOpen,
    Eye,
    EyeOff,
    GraduationCap,
    IdCard,
    Lock,
    Mail,
    User,
    UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/atoms/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Input } from "@/components/ui/atoms/input"
import { Label } from "@/components/ui/atoms/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/atoms/select"
import { useToast } from "@/hooks/useToast"
import { registerRequest } from "@/services/modules/auth.service"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const periods = [
    "1\u00ba Per\u00edodo",
    "2\u00ba Per\u00edodo",
    "3\u00ba Per\u00edodo",
    "4\u00ba Per\u00edodo",
    "5\u00ba Per\u00edodo",
    "6\u00ba Per\u00edodo",
    "7\u00ba Per\u00edodo",
    "8\u00ba Per\u00edodo ou mais",
] as const

type RegisterFormData = {
    fullName: string
    email: string
    age: string
    period: string
    registration: string
    password: string
    confirmPassword: string
    isGraduate: boolean
}

type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>> & {
    submit?: string
}

const initialForm: RegisterFormData = {
    fullName: "",
    email: "",
    age: "",
    period: "",
    registration: "",
    password: "",
    confirmPassword: "",
    isGraduate: false,
}

export default function RegisterPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [form, setForm] = useState<RegisterFormData>(initialForm)
    const [errors, setErrors] = useState<RegisterFormErrors>({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const graduateHint = useMemo(
        () =>
            form.isGraduate
                ? "Como egresso, a matricula nao sera exigida nem enviada no cadastro."
                : "Informe sua matricula para concluir o cadastro.",
        [form.isGraduate],
    )

    const updateField = <K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
            ...(field === "isGraduate" && value ? { registration: "" } : {}),
        }))
        setErrors((prev) => ({ ...prev, [field]: undefined, submit: undefined }))
    }

    const validateForm = () => {
        const nextErrors: RegisterFormErrors = {}
        const normalizedEmail = form.email.trim().toLowerCase()
        const parsedAge = Number(form.age)

        if (!form.fullName.trim()) {
            nextErrors.fullName = "Informe seu nome completo."
        }

        if (!normalizedEmail) {
            nextErrors.email = "Informe seu e-mail."
        } else if (!EMAIL_REGEX.test(normalizedEmail)) {
            nextErrors.email = "Informe um e-mail valido no formato usuario@dominio.extensao."
        }

        if (!form.age.trim()) {
            nextErrors.age = "Informe sua idade."
        } else if (!Number.isInteger(parsedAge) || parsedAge < 16 || parsedAge > 100) {
            nextErrors.age = "A idade informada deve estar entre 16 e 100 anos."
        }

        if (!form.period) {
            nextErrors.period = "Selecione seu periodo."
        }

        if (!form.isGraduate && !form.registration.trim()) {
            nextErrors.registration = "Informe seu numero de matricula."
        }

        if (!form.password) {
            nextErrors.password = "Crie uma senha."
        } else if (form.password.length < 6) {
            nextErrors.password = "A senha deve conter no minimo 6 caracteres."
        }

        if (!form.confirmPassword) {
            nextErrors.confirmPassword = "Confirme sua senha."
        } else if (form.password !== form.confirmPassword) {
            nextErrors.confirmPassword = "As senhas nao coincidem."
        }

        return nextErrors
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const nextErrors = validateForm()
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        setLoading(true)
        setErrors({})

        try {
            await registerRequest({
                name: form.fullName.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
            })

            toast({
                title: "Cadastro realizado com sucesso!",
                description: "Seu acesso foi criado como Aluno ativo. Redirecionando para o login.",
            })

            setTimeout(() => {
                router.push("/auth/login?registered=1")
            }, 700)
        } catch (err: any) {
            const message = err?.response?.data?.error || "Erro ao criar conta. Tente novamente."
            if (message.includes("cadastrado")) {
                setErrors({ email: message })
            } else {
                setErrors({ submit: message })
            }
            toast({
                title: "Falha no cadastro",
                description: message,
                variant: "destructive",
            })
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen px-4 py-10 md:px-6 md:py-14">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="flex flex-col justify-between rounded-[32px] border border-white/60 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/40">
                    <div>
                        <Link href="/" className="mb-10 inline-flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                <BookOpen className="h-6 w-6 text-sky-300" />
                            </div>
                            <div>
                                <span className="block text-2xl font-bold">ContaQuiz</span>
                                <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Cadastro de aluno</span>
                            </div>
                        </Link>

                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">US_02</p>
                        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
                            Crie sua conta com dados pessoais e academicos para iniciar sua jornada no sistema.
                        </h1>
                        <p className="text-lg text-slate-300">
                            O cadastro ativa automaticamente o perfil de Aluno, sem aprovacao manual, e prepara o acesso
                            ao fluxo de quizzes, historico e acompanhamento de desempenho.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <GraduationCap className="mb-3 h-5 w-5 text-sky-300" />
                            <p className="mb-1 font-semibold">Dados academicos</p>
                            <p className="text-sm text-slate-300">Periodo e matricula ajudam a identificar o contexto do aluno.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <Lock className="mb-3 h-5 w-5 text-sky-300" />
                            <p className="mb-1 font-semibold">Acesso imediato</p>
                            <p className="text-sm text-slate-300">Depois do cadastro, o usuario volta ao login com confirmacao de sucesso.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <Card className="w-full border-white/70 bg-white/88 shadow-2xl shadow-slate-200/60 backdrop-blur">
                        <CardHeader className="pb-4 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-3xl">Fazer uma conta</CardTitle>
                            <CardDescription>Preencha seus dados para criar seu acesso de aluno</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nome Completo *</Label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="fullName"
                                            placeholder="Digite seu nome completo"
                                            value={form.fullName}
                                            onChange={(e) => updateField("fullName", e.target.value)}
                                            className="h-11 bg-white pl-10"
                                        />
                                    </div>
                                    {errors.fullName && <p className="text-sm text-destructive-foreground">{errors.fullName}</p>}
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-mail *</Label>
                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="usuario@email.com"
                                                value={form.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                className="h-11 bg-white pl-10"
                                            />
                                        </div>
                                        {errors.email && <p className="text-sm text-destructive-foreground">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="age">Idade *</Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            min={16}
                                            max={100}
                                            placeholder="Digite sua idade"
                                            value={form.age}
                                            onChange={(e) => updateField("age", e.target.value)}
                                            className="h-11 bg-white"
                                        />
                                        {errors.age && <p className="text-sm text-destructive-foreground">{errors.age}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="period">Periodo *</Label>
                                        <Select value={form.period} onValueChange={(value) => updateField("period", value)}>
                                            <SelectTrigger id="period" className="h-11 bg-white">
                                                <SelectValue placeholder="Selecione seu periodo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {periods.map((period) => (
                                                    <SelectItem key={period} value={period}>
                                                        {period}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.period && <p className="text-sm text-destructive-foreground">{errors.period}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="registration">Matricula {!form.isGraduate && "*"}</Label>
                                        <div className="relative">
                                            <IdCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="registration"
                                                placeholder="Digite seu numero de matricula"
                                                value={form.registration}
                                                onChange={(e) => updateField("registration", e.target.value)}
                                                disabled={form.isGraduate}
                                                className="h-11 bg-white pl-10"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{graduateHint}</p>
                                        {errors.registration && <p className="text-sm text-destructive-foreground">{errors.registration}</p>}
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 rounded-2xl border border-border bg-muted/35 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={form.isGraduate}
                                        onChange={(e) => updateField("isGraduate", e.target.checked)}
                                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-foreground">Sou egresso</span>
                                </label>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Senha *</Label>
                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Crie uma senha"
                                                value={form.password}
                                                onChange={(e) => updateField("password", e.target.value)}
                                                className="h-11 bg-white pl-10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-sm text-destructive-foreground">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                                        <div className="relative">
                                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirme sua senha"
                                                value={form.confirmPassword}
                                                onChange={(e) => updateField("confirmPassword", e.target.value)}
                                                className="h-11 bg-white pl-10 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-sm text-destructive-foreground">{errors.confirmPassword}</p>}
                                    </div>
                                </div>

                                {errors.submit && (
                                    <div className="rounded-2xl border border-destructive/30 bg-destructive/15 px-4 py-3 text-sm text-destructive-foreground">
                                        {errors.submit}
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                    <Button type="submit" className="h-11 flex-1 text-base font-medium" disabled={loading}>
                                        {loading ? "Criando conta..." : "Criar Conta"}
                                    </Button>
                                    <Button asChild type="button" variant="outline" className="h-11 flex-1 bg-transparent">
                                        <Link href="/auth/login">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Voltar ao Login
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

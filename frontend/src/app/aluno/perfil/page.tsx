"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Label } from "@/components/ui/atoms/label"
import { Badge } from "@/components/ui/atoms/badge"
import { User, Mail, Shield, Calendar } from "lucide-react"
import { getAuthSession } from "@/lib/auth"
import { getMeRequest } from "@/services/modules/auth.service"
import { useQuery } from "@tanstack/react-query"
import { formatDate } from "@/lib/utils"

export default function AlunoPerfilPage() {
    const [session, setSession] = useState<{ _id: string; name: string; email: string; role: string } | null>(null)

    useEffect(() => {
        const s = getAuthSession()
        if (s) setSession(s)
    }, [])

    const { data: userData, isLoading } = useQuery({
        queryKey: ["user", "me"],
        queryFn: getMeRequest,
        enabled: !!session,
    })

    const user = userData || session

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
                <p className="text-muted-foreground">Informacoes da sua conta no ContaQuiz</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl font-bold text-primary-foreground">
                                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                            </div>
                            <p className="text-xl font-bold text-foreground">{user?.name || "--"}</p>
                            <p className="text-sm text-muted-foreground mt-1">{user?.email || "--"}</p>
                            <Badge variant="secondary" className="mt-3">
                                <Shield className="h-3 w-3 mr-1" />
                                {user?.systemRole === "ADMIN" ? "Administrador" : "Aluno"}
                            </Badge>
                            {userData?.createdAt && (
                                <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Membro desde {formatDate(userData.createdAt)}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados pessoais</CardTitle>
                            <CardDescription>Informacoes associadas a sua conta</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome completo</Label>
                                <div className="relative">
                                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={user?.name || ""}
                                        readOnly
                                        className="h-11 bg-muted/50 pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="h-11 bg-muted/50 pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Tipo de acesso</Label>
                                <div className="relative">
                                    <Shield className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="role"
                                        value={user?.systemRole === "ADMIN" ? "Administrador" : "Aluno"}
                                        readOnly
                                        className="h-11 bg-muted/50 pl-10"
                                    />
                                </div>
                            </div>

                            {userData?.active !== undefined && (
                                <div className="space-y-2">
                                    <Label>Status da conta</Label>
                                    <div>
                                        <Badge variant={userData.active ? "default" : "destructive"}>
                                            {userData.active ? "Ativa" : "Desativada"}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

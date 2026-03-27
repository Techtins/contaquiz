"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Button } from "@/components/ui/atoms/button"
import { BookOpen, Trophy, Play, Clock, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAuthSession } from "@/lib/auth"
import { useDisciplines } from "@/hooks/api/useDisciplines"

export default function AlunoDashboard() {
    const [userName, setUserName] = useState("")
    const { useListDisciplines } = useDisciplines()
    const { data: disciplinesData } = useListDisciplines({ page: 1, limit: 100, active: true })

    useEffect(() => {
        const session = getAuthSession()
        if (session) setUserName(session.name)
    }, [])

    const firstName = userName.split(" ")[0]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Ola, {firstName || "Aluno"}
                </h1>
                <p className="text-muted-foreground">
                    Bem-vindo ao ContaQuiz. Escolha uma disciplina e comece a praticar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{disciplinesData?.items?.length ?? 0}</p>
                                <p className="text-sm text-muted-foreground">Disciplinas disponiveis</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">--</p>
                                <p className="text-sm text-muted-foreground">Quizzes realizados</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">--</p>
                                <p className="text-sm text-muted-foreground">Media de acertos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Acoes rapidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                <Play className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Iniciar Quiz</CardTitle>
                            <CardDescription>Escolha uma disciplina e comece a praticar agora</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/aluno/quizzes">Ver quizzes disponiveis</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                <Trophy className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Historico</CardTitle>
                            <CardDescription>Veja seus resultados anteriores e acompanhe sua evolucao</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full bg-transparent">
                                <Link href="/aluno/historico">Ver historico</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                <Clock className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Meu Perfil</CardTitle>
                            <CardDescription>Gerencie seus dados pessoais e configuracoes da conta</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full bg-transparent">
                                <Link href="/aluno/perfil">Ver perfil</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {disciplinesData?.items && disciplinesData.items.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Disciplinas disponiveis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {disciplinesData.items.map((d: any) => (
                            <Card key={d._id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground">{d.name}</p>
                                            {d.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{d.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Button } from "@/components/ui/atoms/button"
import { BookOpen, Users, FileQuestion, Trophy, BarChart3, Settings, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral da plataforma ContaQuiz</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-sm text-muted-foreground">Disciplinas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileQuestion className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">1,247</p>
                                <p className="text-sm text-muted-foreground">Questões</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">3,456</p>
                                <p className="text-sm text-muted-foreground">Usuários</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Trophy className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">8,923</p>
                                <p className="text-sm text-muted-foreground">Quizzes Realizados</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Management Overview */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Gerenciamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Disciplinas</CardTitle>
                            <CardDescription>Gerencie as disciplinas do sistema</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/admin/disciplinas">Gerenciar</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                <Settings className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Tópicos</CardTitle>
                            <CardDescription>Organize tópicos por disciplina</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/admin/topicos">Gerenciar</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                <FileQuestion className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Questões</CardTitle>
                            <CardDescription>Crie e edite questões dos quizzes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/admin/questoes">Gerenciar</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

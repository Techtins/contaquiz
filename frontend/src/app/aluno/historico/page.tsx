"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/atoms/card"
import { Trophy, Clock, FileQuestion, TrendingUp } from "lucide-react"
import { useStudentHistory } from "@/hooks/api/useHistory"

function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (minutes < 60) return `${minutes}m ${secs}s`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
}

export default function AlunoHistoricoPage() {
    const { data: history, isLoading, isError } = useStudentHistory()

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Historico</h1>
                    <p className="text-muted-foreground">Acompanhe seus resultados e evolucao nos quizzes</p>
                </div>
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-red-500">Erro ao carregar histórico</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isLoading || !history) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Historico</h1>
                    <p className="text-muted-foreground">Acompanhe seus resultados e evolucao nos quizzes</p>
                </div>
                <Card>
                    <CardContent className="py-16 text-center">
                        <div className="animate-pulse">
                            <p className="text-muted-foreground">Carregando...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const hasQuizzes = history.quizzes.length > 0

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Historico</h1>
                <p className="text-muted-foreground">Acompanhe seus resultados e evolucao nos quizzes</p>
            </div>

            {!hasQuizzes ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Trophy className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" />
                        <p className="text-xl font-semibold text-foreground mb-2">Nenhum quiz realizado ainda</p>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Quando voce completar quizzes, seus resultados aparecerao aqui com detalhes de acertos,
                            erros e tempo gasto em cada tentativa.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-5 text-center">
                                <FileQuestion className="h-8 w-8 mx-auto text-primary/40 mb-3" />
                                <p className="text-sm font-medium text-foreground">Quizzes completados</p>
                                <p className="text-3xl font-bold text-foreground mt-1">{history.totalQuizzesCompleted}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-5 text-center">
                                <TrendingUp className="h-8 w-8 mx-auto text-primary/40 mb-3" />
                                <p className="text-sm font-medium text-foreground">Media geral</p>
                                <p className="text-3xl font-bold text-foreground mt-1">{history.averageScore}%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-5 text-center">
                                <Clock className="h-8 w-8 mx-auto text-primary/40 mb-3" />
                                <p className="text-sm font-medium text-foreground">Tempo total de estudo</p>
                                <p className="text-3xl font-bold text-foreground mt-1">{formatTime(history.totalStudyTime)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Seus quizzes</h2>
                        {history.quizzes.map((quiz) => (
                            <Card key={quiz._id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                                            <p className="text-sm text-muted-foreground">{quiz.discipline}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-foreground">Melhor pontuação</p>
                                            <p className="text-2xl font-bold text-primary">{quiz.bestScore}%</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Tentativas</p>
                                            <p className="text-lg font-semibold text-foreground">{quiz.attempts}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Tempo medio</p>
                                            <p className="text-lg font-semibold text-foreground">{formatTime(quiz.averageTime)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Tempo total</p>
                                            <p className="text-lg font-semibold text-foreground">{formatTime(quiz.totalTimeSpent)}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground mb-1">Ultimo acesso</p>
                                            <p className="text-lg font-semibold text-foreground">
                                                {new Date(quiz.lastAttemptDate).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

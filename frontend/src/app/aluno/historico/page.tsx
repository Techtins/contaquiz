"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/atoms/card"
import { Badge } from "@/components/ui/atoms/badge"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/atoms/select"
import { Clock, FileQuestion, TrendingUp, Trophy, Filter, History, BarChart3, Target, AlertTriangle, ArrowRight, Star } from "lucide-react"
import { useDisciplines } from "@/hooks/api/useDisciplines"
import { useStudentHistory } from "@/hooks/api/useHistory"
import { getFavoriteQuestionIds, toggleQuestionFavorite } from "@/services/modules/quiz.service"
import { getQuestionById } from "@/services/modules/questions.service"
import { useToast } from "@/hooks/useToast"

function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (minutes < 60) return `${minutes}m ${secs}s`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
}

function formatDate(value: string | Date): string {
    return new Date(value).toLocaleDateString('pt-BR')
}

export default function AlunoHistoricoPage() {
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState<"overview" | "attempts" | "favorites">("overview")
    const [selectedQuizId, setSelectedQuizId] = useState<string>("all")
    const [disciplineId, setDisciplineId] = useState<string>("all")
    const [visibility, setVisibility] = useState<string>("all")
    const [dateFrom, setDateFrom] = useState<string>("")
    const [dateTo, setDateTo] = useState<string>("")
    const [minScore, setMinScore] = useState<string>("")
    const [maxScore, setMaxScore] = useState<string>("")
    const [favoriteRefreshKey, setFavoriteRefreshKey] = useState(0)
    const [expandedFavoriteQuestionId, setExpandedFavoriteQuestionId] = useState<string | null>(null)

    const { useListDisciplines } = useDisciplines()
    const { data: disciplinesData } = useListDisciplines({ page: 1, limit: 100, active: true })

    const filters = useMemo(() => ({
        ...(selectedQuizId !== "all" ? { quizId: selectedQuizId } : {}),
        ...(disciplineId !== "all" ? { disciplineId } : {}),
        ...(visibility !== "all" ? { visibility: visibility as "PUBLIC" | "PRIVATE" } : {}),
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
        ...(minScore ? { minScore: Number(minScore) } : {}),
        ...(maxScore ? { maxScore: Number(maxScore) } : {}),
    }), [selectedQuizId, disciplineId, visibility, dateFrom, dateTo, minScore, maxScore])

    const { data: history, isLoading, isError } = useStudentHistory(filters)
    const selectedQuizSummary = useMemo(() => {
        if (selectedQuizId === "all") return null
        return history?.quizzes?.find((quiz) => quiz.quizId === selectedQuizId) || null
    }, [history, selectedQuizId])

    const selectedQuizBestScore = selectedQuizSummary?.bestScore ?? Math.max(...(history?.analytics.timeline || []).map((item) => item.percentage), 0)
    const selectedQuizAttempts = selectedQuizSummary?.attempts ?? history?.attempts?.length ?? 0

    const { data: favoriteState } = useQuery({
        queryKey: ["favorite-question-ids", favoriteRefreshKey],
        queryFn: () => getFavoriteQuestionIds(),
        enabled: activeTab === "favorites",
        staleTime: 1000 * 30,
    })

    const favoriteQuestionIds = favoriteState?.questionIds || []

    const { data: favoriteQuestions, isLoading: isLoadingFavorites } = useQuery({
        queryKey: ["favorite-question-details", favoriteQuestionIds, favoriteRefreshKey],
        queryFn: async () => Promise.all(favoriteQuestionIds.map((id) => getQuestionById(id))),
        enabled: activeTab === "favorites" && favoriteQuestionIds.length > 0,
        staleTime: 1000 * 30,
    })

    const handleToggleFavorite = async (questionId: string) => {
        try {
            await toggleQuestionFavorite(questionId)
            setFavoriteRefreshKey((value) => value + 1)
            setExpandedFavoriteQuestionId((current) => (current === questionId ? null : current))
            toast({
                title: "Favoritos atualizados",
                description: "A questão foi adicionada ou removida da revisão futura.",
            })
        } catch {
            toast({
                title: "Erro ao atualizar favorito",
                description: "Não foi possível alterar o favorito agora.",
                variant: "destructive",
            })
        }
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Histórico</h1>
                    <p className="text-muted-foreground">Acompanhe seus resultados e evolução nos quizzes</p>
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
                    <h1 className="text-3xl font-bold text-foreground mb-2">Histórico</h1>
                    <p className="text-muted-foreground">Acompanhe seus resultados e evolução nos quizzes</p>
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

    const disciplines = disciplinesData?.items || []
    const hasAttempts = history.attempts.length > 0
    const hasQuizzes = history.quizzes.length > 0
    const latestAttempt = history.attempts[0]

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-slate-50 via-white to-cyan-50 px-6 py-8 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.06),transparent_32%)]" />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl space-y-3">
                        <Badge variant="secondary" className="w-fit bg-slate-900 text-white hover:bg-slate-800">
                            Desempenho pessoal
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Histórico e evolução de desempenho</h1>
                        <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                            Veja tentativas anteriores, filtre por disciplina, data, tipo de quiz e pontuação, e identifique
                            onde o seu estudo precisa de reforço.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                        <div className="rounded-2xl border bg-white/90 p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Melhor tentativa</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{selectedQuizBestScore}%</p>
                            <p className="mt-1 text-xs text-slate-500">
                                {selectedQuizSummary ? selectedQuizSummary.title : "Visão geral de todos os quizzes"}
                            </p>
                        </div>
                        <div className="rounded-2xl border bg-white/90 p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Última tentativa</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{latestAttempt ? formatDate(latestAttempt.createdAt) : 'Sem dados'}</p>
                        </div>
                        <div className="rounded-2xl border bg-white/90 p-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-slate-500">Tempo total</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{formatTime(history.totalStudyTime)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="border-2 border-primary/10 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Filter className="h-5 w-5 text-primary" />
                        Filtros de histórico
                    </CardTitle>
                    <CardDescription>Filtre as tentativas para comparar períodos, matérias e pontuações.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    <div className="space-y-2 xl:col-span-2">
                        <label className="text-sm font-medium">Quiz específico</label>
                        <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Todos os quizzes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os quizzes</SelectItem>
                                {history.quizzes.map((quiz) => (
                                    <SelectItem key={quiz.quizId} value={quiz.quizId}>{quiz.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Disciplina</label>
                        <Select value={disciplineId} onValueChange={setDisciplineId}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as disciplinas</SelectItem>
                                {disciplines.map((discipline: any) => (
                                    <SelectItem key={discipline._id} value={discipline._id}>{discipline.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de quiz</label>
                        <Select value={visibility} onValueChange={setVisibility}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="PUBLIC">Público</SelectItem>
                                <SelectItem value="PRIVATE">Privado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Data inicial</label>
                        <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Data final</label>
                        <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pontuação mínima</label>
                        <Input type="number" min={0} max={100} value={minScore} onChange={(event) => setMinScore(event.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pontuação máxima</label>
                        <Input type="number" min={0} max={100} value={maxScore} onChange={(event) => setMaxScore(event.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {hasQuizzes && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardContent className="p-5 text-center">
                            <FileQuestion className="mx-auto mb-3 h-8 w-8 text-primary/40" />
                            <p className="text-sm font-medium text-foreground">Quizzes completados</p>
                            <p className="mt-1 text-3xl font-bold text-foreground">{history.totalQuizzesCompleted}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5 text-center">
                            <TrendingUp className="mx-auto mb-3 h-8 w-8 text-primary/40" />
                            <p className="text-sm font-medium text-foreground">Média geral</p>
                            <p className="mt-1 text-3xl font-bold text-foreground">{history.averageScore}%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5 text-center">
                            <Clock className="mx-auto mb-3 h-8 w-8 text-primary/40" />
                            <p className="text-sm font-medium text-foreground">Tempo total</p>
                            <p className="mt-1 text-3xl font-bold text-foreground">{formatTime(history.totalStudyTime)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-5 text-center">
                            <History className="mx-auto mb-3 h-8 w-8 text-primary/40" />
                            <p className="text-sm font-medium text-foreground">Tentativas</p>
                            <p className="mt-1 text-3xl font-bold text-foreground">{history.attempts.length}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex flex-wrap gap-2 border-b pb-2">
                <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>Resumo</Button>
                <Button variant={activeTab === "attempts" ? "default" : "outline"} onClick={() => setActiveTab("attempts")}>Tentativas</Button>
                <Button variant={activeTab === "favorites" ? "default" : "outline"} onClick={() => setActiveTab("favorites")}>
                    <Star className="mr-2 h-4 w-4" />
                    Favoritos
                </Button>
            </div>

            {activeTab === "favorites" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Star className="h-5 w-5 text-primary" />
                            Questões favoritas
                        </CardTitle>
                        <CardDescription>Questões marcadas para revisão futura.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoadingFavorites ? (
                            <p className="text-sm text-muted-foreground">Carregando favoritos...</p>
                        ) : favoriteQuestions && favoriteQuestions.length > 0 ? (
                            favoriteQuestions.map((question: any) => (
                                <div key={question._id} className="rounded-2xl border bg-slate-50/80 p-4 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">{question.difficulty || 'Sem dificuldade'}</Badge>
                                        <Badge variant="outline">{question.type}</Badge>
                                    </div>
                                    <p className="font-semibold text-slate-900">{question.statement}</p>
                                    <p className="text-sm text-slate-600">
                                        {question.disciplineId?.name || 'Disciplina não informada'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button variant="outline" onClick={() => setExpandedFavoriteQuestionId((current) => current === question._id ? null : question._id)}>
                                            {expandedFavoriteQuestionId === question._id ? 'Fechar pergunta' : 'Abrir pergunta'}
                                        </Button>
                                        <Button variant="ghost" onClick={() => handleToggleFavorite(question._id)}>
                                            Remover dos favoritos
                                        </Button>
                                    </div>
                                    {expandedFavoriteQuestionId === question._id && (
                                        <div className="rounded-2xl border bg-white p-4 space-y-3">
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">Alternativas</p>
                                                <div className="mt-3 space-y-2">
                                                    {(question.options || []).map((option: any, index: number) => (
                                                        <div
                                                            key={`${question._id}-${index}`}
                                                            className={`rounded-xl border px-3 py-2 text-sm ${option.isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                                                        >
                                                            {String.fromCharCode(65 + index)}) {option.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {question.explanation && (
                                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                                                    <p className="font-semibold mb-1">Explicação</p>
                                                    <p>{question.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Você ainda não favoritou questões.</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {activeTab === "overview" && !hasAttempts ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Trophy className="mx-auto mb-6 h-16 w-16 text-muted-foreground/40" />
                        <p className="mb-2 text-xl font-semibold text-foreground">Nenhum quiz realizado ainda</p>
                        <p className="mx-auto max-w-md text-muted-foreground">
                            Quando você completar quizzes, as tentativas anteriores, comparativos e gráficos de evolução aparecem aqui.
                        </p>
                    </CardContent>
                </Card>
            ) : activeTab === "overview" ? (
                <>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    {selectedQuizSummary ? `Desempenho de ${selectedQuizSummary.title}` : 'Desempenho ao longo do tempo'}
                                </CardTitle>
                                <CardDescription>
                                    {selectedQuizSummary
                                        ? `A melhor tentativa desse quiz é ${selectedQuizBestScore}% em ${selectedQuizAttempts} tentativa(s).`
                                        : 'Linha do tempo das tentativas recentes.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {history.analytics.timeline.slice(-10).map((item, index) => (
                                    <div key={item.resultId} className="space-y-2 rounded-2xl border bg-slate-50/80 p-3">
                                        <div className="flex items-center justify-between gap-4 text-sm">
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.title}</p>
                                                <p className="text-slate-500">{formatDate(item.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-slate-900">{item.percentage}%</p>
                                                <p className="text-xs text-slate-500">{formatTime(item.timeSpentInSeconds)}</p>
                                            </div>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div className="h-full rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Target className="h-5 w-5 text-primary" />
                                    Identificação de áreas com baixo desempenho
                                </CardTitle>
                                <CardDescription>Os pontos mais frágeis da sua evolução aparecem primeiro.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {history.analytics.lowAreas.length > 0 ? history.analytics.lowAreas.map((item) => (
                                    <div key={`${item.kind}-${item.key}`} className="flex items-start gap-3 rounded-2xl border bg-white p-4">
                                        <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{item.kind === 'DISCIPLINE' ? 'Disciplina' : 'Tema'}</Badge>
                                                <p className="font-semibold text-slate-900">{item.label}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-600">Média de acerto {item.averageScore}% em {item.attempts} tentativas.</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-muted-foreground">Ainda não há dados suficientes para apontar áreas críticas.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Desempenho por disciplina</CardTitle>
                                <CardDescription>Índice de acertos e quantidade de tentativas por matéria.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {history.analytics.byDiscipline.map((item) => (
                                    <div key={item.key} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-slate-900">{item.label}</span>
                                            <span className="text-slate-500">{item.averageScore}% · {item.attempts} tentativas</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${item.averageScore}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Classificação por nível de dificuldade</CardTitle>
                                <CardDescription>Como você performa em questões fáceis, médias e difíceis.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {history.analytics.byDifficulty.map((item) => (
                                    <div key={item.difficulty} className="space-y-2 rounded-2xl border bg-slate-50/80 p-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-slate-900">{item.difficulty}</span>
                                            <span className="text-slate-500">{item.accuracy}% de acerto</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.accuracy}%` }} />
                                        </div>
                                        <p className="text-xs text-slate-500">{item.attempts} questões analisadas</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gráficos por tema</CardTitle>
                                <CardDescription>Índice de acertos por tema ou subtema respondido.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {history.analytics.byTopic.slice(0, 8).map((item) => (
                                    <div key={item.key} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-slate-900">{item.label}</span>
                                            <span className="text-slate-500">{item.averageScore}%</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div className="h-full rounded-full bg-violet-500" style={{ width: `${item.averageScore}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Comparativo entre tentativas</CardTitle>
                                <CardDescription>Veja a evolução tentativa por tentativa em cada quiz.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {history.analytics.comparison.map((quiz) => (
                                    <div key={quiz.quizId} className="rounded-2xl border bg-white p-4">
                                        <p className="font-semibold text-slate-900">{quiz.title}</p>
                                        <div className="mt-3 space-y-2">
                                            {quiz.attempts.map((attempt) => (
                                                <div key={attempt.resultId} className="flex items-center justify-between gap-3 text-sm">
                                                    <span className="text-slate-600">Tentativa {attempt.attemptNumber}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                                                            <div className="h-full rounded-full bg-primary" style={{ width: `${attempt.percentage}%` }} />
                                                        </div>
                                                        <span className="font-semibold text-slate-900">{attempt.percentage}%</span>
                                                        <Button asChild variant="ghost" size="sm">
                                                            <Link href={`/quiz/${quiz.quizId}/resultado/${attempt.resultId}`}>
                                                                Ver
                                                                <ArrowRight className="ml-1 h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : activeTab === "attempts" ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <History className="h-5 w-5 text-primary" />
                            Tentativas anteriores {selectedQuizSummary ? `de ${selectedQuizSummary.title}` : ''}
                        </CardTitle>
                        <CardDescription>
                            {selectedQuizSummary
                                ? `Mostrando ${selectedQuizAttempts} tentativa(s) deste quiz.`
                                : 'Acesso direto ao resultado de cada tentativa passada.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {history.attempts.map((attempt) => (
                            <div key={attempt._id} className="flex flex-col gap-3 rounded-2xl border bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-semibold text-slate-900">{attempt.title}</p>
                                        <Badge variant={attempt.passed ? 'default' : 'secondary'}>{attempt.visibility === 'PRIVATE' ? 'Privado' : 'Público'}</Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">{attempt.discipline || 'Sem disciplina'} · {formatDate(attempt.createdAt)} · {formatTime(attempt.timeSpentInSeconds)}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <p className="text-sm text-slate-500">{attempt.correctAnswers}/{attempt.totalQuestions} acertos</p>
                                    <Badge variant="outline">{attempt.percentage}%</Badge>
                                    <Button asChild>
                                        <Link href={`/quiz/${attempt.quizId}/resultado/${attempt.resultId}`}>
                                            Abrir resultado
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}
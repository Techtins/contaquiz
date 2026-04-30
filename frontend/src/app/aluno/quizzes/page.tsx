"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Button } from "@/components/ui/atoms/button"
import { Badge } from "@/components/ui/atoms/badge"
import { Input } from "@/components/ui/atoms/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/atoms/select"
import { Switch } from "@/components/ui/atoms/switch"
import { BookOpen, CheckCircle2, FileQuestion, Filter, Layers3, Loader2, Shuffle, SlidersHorizontal, Target } from "lucide-react"
import Link from "next/link"
import { useDisciplines } from "@/hooks/api/useDisciplines"
import { useQuizzes } from "@/hooks/api/useQuizzes"
import { useTopics } from "@/hooks/api/useTopics"
import { useToast } from "@/hooks/useToast"
import { generateQuiz as generateQuizRequest } from "@/services/modules/quiz.service"

type QuizMode = "random" | "discipline" | "topic" | "difficulty"
type DifficultyMode = "single" | "mixed"

const quizModes: Array<{ id: QuizMode; title: string; description: string; icon: React.ReactNode }> = [
    {
        id: "random",
        title: "Quiz aleatório",
        description: "Seleciona disciplina, quantidade por tema e dificuldade. Suporta modo misto.",
        icon: <Shuffle className="h-5 w-5" />,
    },
    {
        id: "discipline",
        title: "Quiz por disciplina",
        description: "Escolha uma disciplina e monte uma prática focada nela.",
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        id: "topic",
        title: "Quiz por tema ou subtema",
        description: "Questões vinculadas a tópicos e subtópicos para estudo direcionado.",
        icon: <Layers3 className="h-5 w-5" />,
    },
    {
        id: "difficulty",
        title: "Quiz por nível de dificuldade",
        description: "Filtra questões por dificuldade para treinar no ritmo certo.",
        icon: <Target className="h-5 w-5" />,
    },
]

export default function AlunoQuizzesPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [selectedMode, setSelectedMode] = useState<QuizMode>("random")
    const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all")
    const [selectedTopic, setSelectedTopic] = useState<string>("all")
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("FACIL")
    const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>("single")
    const [questionCount, setQuestionCount] = useState<number>(10)
    const [questionsPerTopic, setQuestionsPerTopic] = useState<number>(3)
    const [quizName, setQuizName] = useState<string>("")
    const [isGenerating, setIsGenerating] = useState(false)

    const { useListDisciplines } = useDisciplines()
    const { useListQuizzes } = useQuizzes()
    const { useListTopics } = useTopics()

    const { data: disciplinesData } = useListDisciplines({ page: 1, limit: 100, active: true })
    const { data: topicsData } = useListTopics({ page: 1, limit: 100, ...(selectedDiscipline !== "all" ? { disciplineId: selectedDiscipline } : {}) })
    const { data: quizzesData, isLoading } = useListQuizzes({
        page: 1,
        limit: 50,
        ...(selectedDiscipline !== "all" ? { disciplineId: selectedDiscipline } : {}),
    })

    const quizzes = quizzesData?.items || quizzesData || []
    const selectedDisciplineName = disciplinesData?.items?.find((item: any) => item._id === selectedDiscipline)?.name || "Todas as disciplinas"
    const selectedTopicName = topicsData?.items?.find((item: any) => item._id === selectedTopic)?.name || "Todos os tópicos"

    const getDisciplineName = (disciplineId: string) => {
        const d = disciplinesData?.items?.find((item: any) => item._id === disciplineId)
        return d?.name || "Disciplina"
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        return `${m} min`
    }

    const handleGenerateRandomQuiz = async () => {
        if (selectedDiscipline === "all") {
            toast({ title: "Selecione uma disciplina", description: "Escolha uma disciplina para gerar o quiz aleatório." })
            return
        }

        if (!quizName.trim()) {
            toast({ title: "Nome obrigatório", description: "Digite um nome para o seu quiz." })
            return
        }

        try {
            setIsGenerating(true)
            const generatedQuiz = await generateQuizRequest({
                title: quizName.trim(),
                disciplineId: selectedDiscipline,
                questionsPerTopic,
                questionCount,
                difficulty: difficultyMode === "mixed" ? undefined : selectedDifficulty,
                mixedDifficulty: difficultyMode === "mixed",
                timeLimitSeconds: Math.max(600, questionCount * 90),
                score: 70,
                active: true,
            })

            toast({
                title: "Quiz gerado",
                description: "Seu quiz foi criado com sucesso.",
            })

            setQuizName("")
            router.push(`/quiz/${generatedQuiz._id}`)
        } catch (error: any) {
            const backendMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message;
            console.error('Falha ao gerar quiz aleatorio:', error);
            toast({
                title: "Erro ao gerar quiz",
                description: backendMessage || "Não foi possível gerar o quiz agora.",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const activeMode = useMemo(() => quizModes.find((mode) => mode.id === selectedMode), [selectedMode])

    const configPreview = useMemo(() => {
        if (selectedMode === "random") {
            return [
                `Disciplina: ${selectedDisciplineName}`,
                `Questões por tema: ${questionsPerTopic}`,
                `Nível: ${difficultyMode === "mixed" ? "Misto" : selectedDifficulty}`,
            ]
        }

        if (selectedMode === "discipline") {
            return [
                `Disciplina: ${selectedDisciplineName}`,
                `Quantidade: ${questionCount} questões`,
                `Nível: ${difficultyMode === "mixed" ? "Misto" : selectedDifficulty}`,
            ]
        }

        if (selectedMode === "topic") {
            return [
                `Disciplina: ${selectedDisciplineName}`,
                `Tópico: ${selectedTopicName}`,
                `Quantidade: ${questionCount} questões`,
            ]
        }

        return [
            `Nível: ${difficultyMode === "mixed" ? "Misto" : selectedDifficulty}`,
            `Quantidade: ${questionCount} questões`,
            `Disciplina: ${selectedDisciplineName}`,
        ]
    }, [selectedMode, selectedDisciplineName, selectedTopicName, questionsPerTopic, difficultyMode, selectedDifficulty, questionCount])

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-slate-50 via-white to-cyan-50 px-6 py-8 text-slate-900 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.06),transparent_32%)]" />
                <div className="relative max-w-3xl space-y-3">
                    <Badge variant="secondary" className="w-fit bg-slate-900 text-white hover:bg-slate-800">
                        Selecionar tipo de quiz
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Monte o modo de estudo ideal antes de começar</h1>
                    <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                        Escolha entre quiz aleatório, por disciplina, por tema/subtema ou por nível de dificuldade. A tela já deixa a estrutura pronta para integração com o backend depois da sua validação.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                <div className="space-y-6">
                    <Card className="border-2 border-primary/10 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <SlidersHorizontal className="h-5 w-5 text-primary" />
                                Tipo de quiz
                            </CardTitle>
                            <CardDescription>Escolha o formato e ajuste os filtros abaixo.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            {quizModes.map((mode) => {
                                const isActive = selectedMode === mode.id
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => setSelectedMode(mode.id)}
                                        className={`rounded-2xl border p-4 text-left transition-all ${
                                            isActive
                                                ? "border-primary bg-primary/5 shadow-md"
                                                : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                                        }`}
                                    >
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            {mode.icon}
                                        </div>
                                        <h3 className="text-base font-semibold">{mode.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{mode.description}</p>
                                    </button>
                                )
                            })}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Filter className="h-5 w-5 text-primary" />
                                Configuração do quiz
                            </CardTitle>
                            <CardDescription>
                                {activeMode?.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome do quiz *</label>
                                <Input
                                    type="text"
                                    placeholder="Ex: Quiz de Contabilidade Geral"
                                    value={quizName}
                                    onChange={(event) => setQuizName(event.target.value)}
                                    disabled={isGenerating}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Disciplina</label>
                                    <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Selecione uma disciplina" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas as disciplinas</SelectItem>
                                            {disciplinesData?.items?.map((d: any) => (
                                                <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(selectedMode === "random" || selectedMode === "discipline" || selectedMode === "difficulty") && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Quantidade de questões</label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={questionCount}
                                            onChange={(event) => setQuestionCount(Number(event.target.value) || 1)}
                                        />
                                    </div>
                                )}
                            </div>

                            {selectedMode === "topic" && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tema / subtema</label>
                                        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Selecione um tópico" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos os tópicos</SelectItem>
                                                {topicsData?.items?.map((topic: any) => (
                                                    <SelectItem key={topic._id} value={topic._id}>{topic.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Quantidade de questões</label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={questionCount}
                                            onChange={(event) => setQuestionCount(Number(event.target.value) || 1)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nível de dificuldade</label>
                                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty} disabled={difficultyMode === "mixed"}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Selecione a dificuldade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FACIL">Fácil</SelectItem>
                                            <SelectItem value="MEDIO">Médio</SelectItem>
                                            <SelectItem value="DIFICIL">Difícil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 rounded-2xl border p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium">Modo misto</p>
                                            <p className="text-xs text-muted-foreground">Mistura questões de várias dificuldades.</p>
                                        </div>
                                        <Switch checked={difficultyMode === "mixed"} onCheckedChange={(checked) => setDifficultyMode(checked ? "mixed" : "single")} />
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {difficultyMode === "mixed"
                                            ? "O quiz puxará questões de níveis diferentes automaticamente."
                                            : "O quiz seguirá apenas a dificuldade selecionada."}
                                    </div>
                                </div>
                            </div>

                            {selectedMode === "random" && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Questões por tema</label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={20}
                                            value={questionsPerTopic}
                                            onChange={(event) => setQuestionsPerTopic(Number(event.target.value) || 1)}
                                        />
                                    </div>
                                    <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                                        No modo aleatório, o aluno escolhe uma disciplina, define a quantidade por tema e pode alternar entre uma dificuldade fixa ou o modo misto.
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <Button
                                            type="button"
                                            className="gap-2"
                                            onClick={handleGenerateRandomQuiz}
                                            disabled={isGenerating || selectedDiscipline === "all"}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Gerando...
                                                </>
                                            ) : (
                                                <>
                                                    <Shuffle className="h-4 w-4" />
                                                    Gerar quiz aleatório
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-2 border-primary/10 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                Prévia da seleção
                            </CardTitle>
                            <CardDescription>Esse resumo vai servir como base para a integração do backend.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{activeMode?.title}</Badge>
                                <Badge variant="outline">{selectedDisciplineName}</Badge>
                            </div>
                            <div className="space-y-2 rounded-2xl bg-background p-4">
                                {configPreview.map((item) => (
                                    <div key={item} className="text-sm text-foreground">• {item}</div>
                                ))}
                            </div>
                            {selectedMode === "random" && (
                                <Button
                                    type="button"
                                    className="w-full gap-2"
                                    onClick={handleGenerateRandomQuiz}
                                    disabled={isGenerating || selectedDiscipline === "all"}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Gerando quiz...
                                        </>
                                    ) : (
                                        <>
                                            <Shuffle className="h-4 w-4" />
                                            Gerar quiz aleatório
                                        </>
                                    )}
                                </Button>
                            )}
                            <p className="text-xs text-muted-foreground">
                                O botão gera o quiz aleatório com a configuração selecionada e abre o quiz criado em seguida.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quizzes disponíveis</CardTitle>
                            <CardDescription>Você ainda pode usar os quizzes prontos abaixo enquanto o fluxo novo é validado.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{selectedDisciplineName}</Badge>
                                <Badge variant="outline">{isLoading ? "Carregando..." : `${quizzes.length} disponíveis`}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Quizzes disponíveis</h2>
                        <p className="text-muted-foreground">A lista abaixo continua funcionando enquanto o novo fluxo é validado.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : quizzes.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-medium text-foreground">Nenhum quiz disponível</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Ainda não há quizzes cadastrados para a disciplina selecionada.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {quizzes.map((quiz: any) => (
                            <Card key={quiz._id} className="border-2 transition-shadow hover:border-primary/30 hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg leading-tight">{quiz.title}</CardTitle>
                                    </div>
                                    {quiz.description && (
                                        <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="gap-1">
                                            <BookOpen className="h-3 w-3" />
                                            {getDisciplineName(quiz.disciplineId)}
                                        </Badge>
                                        <Badge variant="outline" className="gap-1">
                                            <FileQuestion className="h-3 w-3" />
                                            {quiz.questions?.length || 0} questões
                                        </Badge>
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Nota mínima: {quiz.passingScore}% · Duração: {formatTime(quiz.timeLimit)}
                                    </div>

                                    <Button asChild className="w-full gap-2">
                                        <Link href={`/quiz/${quiz._id}`}>
                                            <CheckCircle2 className="h-4 w-4" />
                                            Iniciar quiz
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card"
import { Button } from "@/components/ui/atoms/button"
import { Badge } from "@/components/ui/atoms/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/atoms/select"
import { Play, Clock, FileQuestion, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"
import { useDisciplines } from "@/hooks/api/useDisciplines"
import { useQuizzes } from "@/hooks/api/useQuizzes"

export default function AlunoQuizzesPage() {
    const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all")

    const { useListDisciplines } = useDisciplines()
    const { useListQuizzes } = useQuizzes()

    const { data: disciplinesData } = useListDisciplines({ page: 1, limit: 100, active: true })
    const { data: quizzesData, isLoading } = useListQuizzes({
        page: 1,
        limit: 50,
        ...(selectedDiscipline !== "all" ? { disciplineId: selectedDiscipline } : {}),
    })

    const quizzes = quizzesData?.items || quizzesData || []

    const getDisciplineName = (disciplineId: string) => {
        const d = disciplinesData?.items?.find((item: any) => item._id === disciplineId)
        return d?.name || "Disciplina"
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        return `${m} min`
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Quizzes disponiveis</h1>
                <p className="text-muted-foreground">Escolha um quiz para iniciar sua pratica</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-64">
                    <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Filtrar por disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as disciplinas</SelectItem>
                            {disciplinesData?.items?.map((d: any) => (
                                <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                        <p className="text-lg font-medium text-foreground">Nenhum quiz disponivel</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Ainda nao ha quizzes cadastrados para a disciplina selecionada.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz: any) => (
                        <Card key={quiz._id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
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
                                        {quiz.questions?.length || 0} questoes
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(quiz.timeLimit)}
                                    </Badge>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    Nota minima: {quiz.passingScore}%
                                </div>

                                <Button asChild className="w-full gap-2">
                                    <Link href={`/quiz/${quiz._id}`}>
                                        <Play className="h-4 w-4" />
                                        Iniciar Quiz
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

"use client"

import { Card, CardContent } from "@/components/ui/atoms/card"
import { Trophy, Clock, FileQuestion } from "lucide-react"

export default function AlunoHistoricoPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Historico</h1>
                <p className="text-muted-foreground">Acompanhe seus resultados e evolucao nos quizzes</p>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-5 text-center">
                        <FileQuestion className="h-8 w-8 mx-auto text-primary/40 mb-3" />
                        <p className="text-sm font-medium text-foreground">Quizzes completados</p>
                        <p className="text-3xl font-bold text-foreground mt-1">--</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5 text-center">
                        <Trophy className="h-8 w-8 mx-auto text-primary/40 mb-3" />
                        <p className="text-sm font-medium text-foreground">Media geral</p>
                        <p className="text-3xl font-bold text-foreground mt-1">--%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5 text-center">
                        <Clock className="h-8 w-8 mx-auto text-primary/40 mb-3" />
                        <p className="text-sm font-medium text-foreground">Tempo total de estudo</p>
                        <p className="text-3xl font-bold text-foreground mt-1">--</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

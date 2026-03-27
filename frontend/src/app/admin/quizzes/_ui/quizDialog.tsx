'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/atoms/dialog";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { Textarea } from "@/components/ui/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/atoms/select";
import { Switch } from "@/components/ui/atoms/switch";
import { Quiz, QuizFormData } from "@/lib/interface/IQuiz";
import { useDisciplines } from "@/hooks/api/useDisciplines";
import { useQuestions } from "@/hooks/api/useQuestions";

interface QuizDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: QuizFormData) => void;
    initialData?: Quiz | null;
}

export function QuizDialog({ isOpen, onOpenChange, onSubmit, initialData }: QuizDialogProps) {
    const initialFormData: QuizFormData = initialData
        ? {
            title: initialData.title,
            description: initialData.description,
            disciplineId: initialData.disciplineId,
            questions: initialData.questions.map(q => q._id),
            timeLimit: initialData.timeLimit,
            passingScore: initialData.passingScore,
            active: initialData.active,
        }
        : {
            title: "",
            description: "",
            disciplineId: "",
            questions: [],
            timeLimit: 1800,
            passingScore: 70,
            active: true,
        };

    const [formData, setFormData] = useState<QuizFormData>(initialFormData);

    const { useListDisciplines } = useDisciplines();
    const { useListQuestions } = useQuestions();

    const { data: disciplines } = useListDisciplines({ page: 1, limit: 100 });
    const { data: questions } = useListQuestions({
        page: 1,
        limit: 1000,
        disciplineId: formData.disciplineId
    });

    const handleSubmitClick = () => {
        onSubmit(formData);
        setFormData(initialFormData);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Quiz" : "Novo Quiz"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Atualize os dados do quiz" : "Crie um novo quiz selecionando questões"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Quiz de Contabilidade Básica"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descrição do quiz"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="discipline">Disciplina</Label>
                        <Select
                            value={formData.disciplineId}
                            onValueChange={(value) => setFormData({ ...formData, disciplineId: value, questions: [] })}
                        >
                            <SelectTrigger id="discipline">
                                <SelectValue placeholder="Selecione uma disciplina" />
                            </SelectTrigger>
                            <SelectContent>
                                {disciplines?.items?.map((discipline: any) => (
                                    <SelectItem key={discipline._id} value={discipline._id}>
                                        {discipline.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.disciplineId && (
                        <div>
                            <Label>Questões ({formData.questions.length})</Label>
                            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                                {questions?.items?.map((question: any) => (
                                    <label key={question._id} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.questions.includes(question._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({
                                                        ...formData,
                                                        questions: [...formData.questions, question._id]
                                                    });
                                                } else {
                                                    setFormData({
                                                        ...formData,
                                                        questions: formData.questions.filter(id => id !== question._id)
                                                    });
                                                }
                                            }}
                                            className="rounded"
                                        />
                                        <span className="text-sm">{question.statement.slice(0, 60)}...</span>
                                    </label>
                                ))}
                                {!questions?.items?.length && (
                                    <p className="text-sm text-gray-500 text-center py-4">Nenhuma questão encontrada</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="timeLimit">Tempo Limite (minutos)</Label>
                        <Input
                            id="timeLimit"
                            type="number"
                            value={formData.timeLimit / 60}
                            onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) * 60 })}
                            min="1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="passingScore">Pontuação Mínima (%)</Label>
                        <Input
                            id="passingScore"
                            type="number"
                            value={formData.passingScore}
                            onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch
                            checked={formData.active}
                            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                        />
                        <Label>Ativo</Label>
                    </div>
                </div>

                <div className="flex gap-2 justify-end mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmitClick}>
                        {initialData ? "Atualizar" : "Criar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

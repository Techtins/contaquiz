"use client"

import { useMemo, useState } from "react"
import { Button } from "../../../components/ui/atoms/button"
import { Input } from "../../../components/ui/atoms/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/atoms/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/atoms/table"
import { Badge } from "../../../components/ui/atoms/badge"
import { Trash2, Edit, Plus, Search, Filter } from "lucide-react"
import { useToast } from "../../../hooks/useToast"
import { Hint } from '../../../components/ui/atoms/tooltip';
import { useQuestions } from '@/hooks/api/useQuestions';
import { useDisciplines } from '@/hooks/api/useDisciplines';
import { useTopics } from '@/hooks/api/useTopics';
import { setDialog } from '@/lib/utils';
import { DifficultyLevel, Question, QuestionFormData } from '@/lib/interface/IQuestao';
import { QuestionDialog } from './_ui/questionDialog';
import { QuestionAlertDialog } from './_ui/questionAlertDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/atoms/select';

export default function QuestõesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
    const [selectedTopicId, setSelectedTopicId] = useState<string>("all")
    const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>("all")

    const [dialogState, setDialogState] = useState<{ isOpenCreateOrEditDialog: boolean; isOpenDeleteDialog: boolean; data?: Question | null }>({
        isOpenCreateOrEditDialog: false,
        isOpenDeleteDialog: false,
        data: null,
    });

    const { toast } = useToast()
    const { useListQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion } = useQuestions();
    const { useListDisciplines } = useDisciplines();
    const { useListTopics } = useTopics();

    const { data: disciplinesData } = useListDisciplines({ page: 1, limit: 100, active: true });
    const { data: topicsData } = useListTopics({
        page: 1,
        limit: 100,
        ...(selectedDisciplineId !== "all" ? { disciplineId: selectedDisciplineId } : {}),
    });

    const { data: dataQuestions, isError, isLoading } = useListQuestions({
        page: 1,
        limit: 10,
        filter: searchQuery,
        ...(selectedDisciplineId !== "all" ? { disciplineId: selectedDisciplineId } : {}),
        ...(selectedDifficulty !== "all" ? { difficulty: selectedDifficulty as DifficultyLevel } : {}),
        ...(selectedTopicId !== "all" ? { topicId: selectedTopicId } : {}),
    });
    const { mutate: createQuestion } = useCreateQuestion();
    const { mutate: updateQuestion } = useUpdateQuestion();
    const { mutate: deleteQuestion } = useDeleteQuestion();

    const topicNameById = useMemo(() => {
        return new Map((topicsData?.items || []).map((topic: any) => [topic._id, topic.name]));
    }, [topicsData]);

    const selectedDisciplineName = disciplinesData?.items?.find((item: any) => item._id === selectedDisciplineId)?.name || "Todas as disciplinas";

    const handleSaveQuestion = (data: QuestionFormData) => {
        if (dialogState.data?._id) {
            updateQuestion({ id: dialogState.data._id, payload: data });
            toast({ title: "Questão atualizada!", description: `A questão "${data.statement?.slice(0, 20)}..." foi atualizada.` });
        }
        else {
            createQuestion(data);
            toast({ title: "Questão criada!", description: `A questão "${data.statement?.slice(0, 20)}..." foi criada.` });
        }
        closeDialog();
    };

    const handleDeleteQuestion = () => {
        if (!dialogState.data?._id) return;
        deleteQuestion(dialogState.data._id);
        toast({ title: "Questão excluída!", description: `A questão foi removida.` });
        closeDialog();
    }

    const openCreateDialog = () => setDialogState(setDialog("createOrEdit", null));
    const openEditDialog = (discipline: Question) => setDialogState(setDialog("createOrEdit", discipline));
    const openDeleteDialog = (discipline: Question) => setDialogState(setDialog("delete", discipline));
    const closeDialog = () => setDialogState(setDialog("none", null));

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Gerenciar Questões</CardTitle>
                    <CardDescription>Crie, edite e gerencie as questões do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search and Create */}
                    <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex-1 relative md:col-span-2">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Buscar questões..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={selectedDisciplineId} onValueChange={(value) => {
                                setSelectedDisciplineId(value);
                                setSelectedTopicId("all");
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por disciplina" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as disciplinas</SelectItem>
                                    {disciplinesData?.items?.map((discipline: any) => (
                                        <SelectItem key={discipline._id} value={discipline._id}>{discipline.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por dificuldade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as dificuldades</SelectItem>
                                    {Object.values(DifficultyLevel).map((difficulty) => (
                                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Filter className="h-4 w-4" />
                                <span>Tema / subtema</span>
                                <span className="font-medium text-foreground">{selectedDisciplineName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                                    <SelectTrigger className="w-[280px]">
                                        <SelectValue placeholder="Filtrar por tópico" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os tópicos</SelectItem>
                                        {topicsData?.items?.map((topic: any) => (
                                            <SelectItem key={topic._id} value={topic._id}>{topic.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button className={'cursor-pointer'} onClick={openCreateDialog}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nova Questão
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Enunciado</TableHead>
                                    <TableHead>Tema / subtema</TableHead>
                                    <TableHead>Dificuldade</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criada em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            Carregando questões...
                                        </TableCell>
                                    </TableRow>
                                ) : dataQuestions?.total === 0 || !dataQuestions?.items.length || isError ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {searchQuery ? "Nenhuma questão encontrada" : "Nenhuma questão cadastrada"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    dataQuestions?.items?.map((discipline) => (
                                        <TableRow key={discipline._id}>
                                            <TableCell className="font-medium">{discipline.statement?.split(" ")?.slice(0, 8).join(" ")}</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                <div className="flex flex-wrap gap-2">
                                                    {(discipline.topicIds || []).length > 0 ? (
                                                        discipline.topicIds?.map((topicId) => (
                                                            <Badge key={topicId} variant="secondary">{topicNameById.get(topicId) || topicId}</Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted-foreground">Sem tópico</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{discipline.difficulty || "-"}</TableCell>
                                            <TableCell>
                                                <Badge variant={discipline.active ? "default" : "secondary"}>
                                                    {discipline.active ? "Ativa" : "Inativa"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(discipline.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Hint label="Editar">
                                                        <Button className="cursor-pointer hover:text-white hover:bg-yellow-600" variant="outline" size="sm" onClick={() => openEditDialog(discipline)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Hint>

                                                    <Hint label="Excluir" tone="destructive">
                                                        <Button className="cursor-pointer hover:text-white hover:bg-red-600" variant="outline" size="sm" onClick={() => openDeleteDialog(discipline)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </Hint>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {/* Create/Edit Dialog */}
            <QuestionDialog
                isOpen={dialogState.isOpenCreateOrEditDialog}
                onOpenChange={closeDialog}
                onSubmit={handleSaveQuestion}
                initialData={dialogState.data}
            />

            {/* Delete Confirmation Dialog */}
            <QuestionAlertDialog
                data={dialogState.data || null}
                isOpen={dialogState.isOpenDeleteDialog}
                onOpenChange={closeDialog}
                onConfirm={handleDeleteQuestion}
            />
        </div>
    )
}

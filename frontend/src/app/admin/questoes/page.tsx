/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import 'dotenv/config';
import { useState } from "react"
import { Button } from "../../../components/ui/atoms/button"
import { Input } from "../../../components/ui/atoms/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/atoms/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/atoms/table"
import { Badge } from "../../../components/ui/atoms/badge"
import { Trash2, Edit, Plus, Search } from "lucide-react"
import { useToast } from "../../../hooks/useToast"
import { Hint } from '../../../components/ui/atoms/tooltip';
import { useQuestions } from '@/hooks/api/useQuestions';
import { setDialog } from '@/lib/utils';
import { Question, QuestionFormData } from '@/lib/interface/IQuestao';
import { QuestionDialog } from './_ui/questionDialog';
import { QuestionAlertDialog } from './_ui/questionAlertDialog';

export default function QuestõesPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const [dialogState, setDialogState] = useState<{ isOpenCreateOrEditDialog: boolean; isOpenDeleteDialog: boolean; data?: Question | null }>({
        isOpenCreateOrEditDialog: false,
        isOpenDeleteDialog: false,
        data: null,
    });

    const { toast } = useToast()
    const { useListQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion } = useQuestions();

    const { data: dataQuestions, isError, isLoading } = useListQuestions({ page: 1, limit: 10, filter: searchQuery });
    const { mutate: createQuestion } = useCreateQuestion();
    const { mutate: updateQuestion } = useUpdateQuestion();
    const { mutate: deleteQuestion } = useDeleteQuestion();

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
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar questões..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button className={'cursor-pointer'} onClick={openCreateDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Questão
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Enunciado</TableHead>
                                    <TableHead>Dificuldade</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criada em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            Carregando questões...
                                        </TableCell>
                                    </TableRow>
                                ) : dataQuestions?.total === 0 || !dataQuestions?.items.length || isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {searchQuery ? "Nenhuma questão encontrada" : "Nenhuma questão cadastrada"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    dataQuestions?.items?.map((discipline) => (
                                        <TableRow key={discipline._id}>
                                            <TableCell className="font-medium">{discipline.statement?.split(" ")?.slice(0, 8).join(" ")}</TableCell>
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

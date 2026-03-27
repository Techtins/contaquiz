'use client';

import { useState } from "react";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/atoms/table";
import { Badge } from "@/components/ui/atoms/badge";
import { Trash2, Edit, Plus, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Quiz, QuizFormData } from "@/lib/interface/IQuiz";
import { Hint } from '@/components/ui/atoms/tooltip';
import { useQuizzes } from '@/hooks/api/useQuizzes';
import { QuizDialog } from './_ui/quizDialog';
import { QuizAlertDialog } from './_ui/quizAlertDialog';
import { setDialog } from '@/lib/utils';
import { useRouter } from "next/navigation";

export default function QuizzesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const [dialogState, setDialogState] = useState<{ isOpenCreateOrEditDialog: boolean; isOpenDeleteDialog: boolean; data?: Quiz | null }>({
        isOpenCreateOrEditDialog: false,
        isOpenDeleteDialog: false,
        data: null,
    });

    const { toast } = useToast();
    const { useListQuizzes, useCreateQuiz, useUpdateQuiz, useDeleteQuiz } = useQuizzes();

    const { data: dataQuizzes, isError, isLoading } = useListQuizzes({ page: 1, limit: 10, filter: searchQuery });
    const { mutate: createQuiz } = useCreateQuiz();
    const { mutate: updateQuiz } = useUpdateQuiz();
    const { mutate: deleteQuiz } = useDeleteQuiz();

    const handleSaveQuiz = (data: QuizFormData) => {
        if (dialogState.data?._id) {
            updateQuiz({ id: dialogState.data._id, payload: data });
            toast({ title: "Quiz atualizado!", description: `O quiz "${data.title}" foi atualizado.` });
        } else {
            createQuiz(data);
            toast({ title: "Quiz criado!", description: `O quiz "${data.title}" foi criado.` });
        }
        closeDialog();
    };

    const handleDeleteQuiz = () => {
        if (!dialogState.data?._id) return;
        deleteQuiz(dialogState.data._id);
        toast({ title: "Quiz excluído!", description: `O quiz foi removido.` });
        closeDialog();
    };

    const openCreateDialog = () => setDialogState(setDialog("createOrEdit", null));
    const openEditDialog = (quiz: Quiz) => setDialogState(setDialog("createOrEdit", quiz));
    const openDeleteDialog = (quiz: Quiz) => setDialogState(setDialog("delete", quiz));
    const closeDialog = () => setDialogState(setDialog("none", null));

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Gerenciar Quizzes</CardTitle>
                    <CardDescription>Crie, edite e gerencie quizzes do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search and Create */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar quizzes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button className={'cursor-pointer'} onClick={openCreateDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Quiz
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Questões</TableHead>
                                    <TableHead>Tempo Limite</TableHead>
                                    <TableHead>Pont. Min.</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            Carregando quizzes...
                                        </TableCell>
                                    </TableRow>
                                ) : dataQuizzes?.total === 0 || !dataQuizzes?.items.length || isError ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {searchQuery ? "Nenhum quiz encontrado" : "Nenhum quiz cadastrado"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    dataQuizzes?.items?.map((quiz: Quiz) => (
                                        <TableRow key={quiz._id}>
                                            <TableCell className="font-medium">{quiz.title}</TableCell>
                                            <TableCell>{quiz.questions?.length || 0}</TableCell>
                                            <TableCell>{quiz.timeLimit / 60} min</TableCell>
                                            <TableCell>{quiz.passingScore}%</TableCell>
                                            <TableCell>
                                                <Badge variant={quiz.active ? "default" : "secondary"}>
                                                    {quiz.active ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Hint label="Visualizar">
                                                        <Button
                                                            className="cursor-pointer hover:text-white hover:bg-blue-600"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/quiz/${quiz._id}`)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Hint>

                                                    <Hint label="Editar">
                                                        <Button
                                                            className="cursor-pointer hover:text-white hover:bg-yellow-600"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditDialog(quiz)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Hint>

                                                    <Hint label="Excluir" tone="destructive">
                                                        <Button
                                                            className="cursor-pointer hover:text-white hover:bg-red-600"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(quiz)}
                                                        >
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
            <QuizDialog
                isOpen={dialogState.isOpenCreateOrEditDialog}
                onOpenChange={closeDialog}
                onSubmit={handleSaveQuiz}
                initialData={dialogState.data}
            />

            {/* Delete Confirmation Dialog */}
            <QuizAlertDialog
                data={dialogState.data || null}
                isOpen={dialogState.isOpenDeleteDialog}
                onOpenChange={closeDialog}
                onConfirm={handleDeleteQuiz}
            />
        </div>
    );
}

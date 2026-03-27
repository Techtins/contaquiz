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
import { Discipline, DisciplineFormData } from "../../../lib/interface/IDisciplina"
import { Hint } from '../../../components/ui/atoms/tooltip';
import { useDisciplines } from '@/hooks/api/useDisciplines';
import { DisciplineDialog } from './_ui/disciplineDialog';
import { DisciplineAlertDialog } from './_ui/disciplineAlertDialog';
import { setDialog } from '@/lib/utils';

export default function DisciplinasPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const [dialogState, setDialogState] = useState<{ isOpenCreateOrEditDialog: boolean; isOpenDeleteDialog: boolean; data?: Discipline | null }>({
        isOpenCreateOrEditDialog: false,
        isOpenDeleteDialog: false,
        data: null,
    });

    const { toast } = useToast()
    const { useListDisciplines, useCreateDiscipline, useUpdateDiscipline, useDeleteDiscipline } = useDisciplines();

    const { data: dataDisciplines, isError, isLoading } = useListDisciplines({ page: 1, limit: 10, filter: searchQuery });
    const { mutate: createDiscipline } = useCreateDiscipline();
    const { mutate: updateDiscipline } = useUpdateDiscipline();
    const { mutate: deleteDiscipline } = useDeleteDiscipline();

    const handleSaveDiscipline = (data: DisciplineFormData) => {
        if (dialogState.data?._id) {
            updateDiscipline({ id: dialogState.data._id, payload: data });
            toast({ title: "Disciplina atualizada!", description: `A disciplina "${data.name}" foi atualizada.` });
        }
        else {
            createDiscipline(data);
            toast({ title: "Disciplina criada!", description: `A disciplina "${data.name}" foi criada.` });
        }
        closeDialog();
    };

    const handleDeleteDiscipline = () => {
        if (!dialogState.data?._id) return;
        deleteDiscipline(dialogState.data._id);
        toast({ title: "Disciplina excluída!", description: `A disciplina foi removida.` });
        closeDialog();
    }

    const openCreateDialog = () => setDialogState(setDialog("createOrEdit", null));
    const openEditDialog = (discipline: Discipline) => setDialogState(setDialog("createOrEdit", discipline));
    const openDeleteDialog = (discipline: Discipline) => setDialogState(setDialog("delete", discipline));
    const closeDialog = () => setDialogState(setDialog("none", null));

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Gerenciar Disciplinas</CardTitle>
                    <CardDescription>Crie, edite e gerencie as disciplinas do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search and Create */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar disciplinas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button className={'cursor-pointer'} onClick={openCreateDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Disciplina
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criada em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            Carregando disciplinas...
                                        </TableCell>
                                    </TableRow>
                                ) : dataDisciplines?.total === 0 || !dataDisciplines?.items.length || isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {searchQuery ? "Nenhuma disciplina encontrada" : "Nenhuma disciplina cadastrada"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    dataDisciplines?.items?.map((discipline) => (
                                        <TableRow key={discipline._id}>
                                            <TableCell className="font-medium">{discipline.name}</TableCell>
                                            <TableCell className="max-w-xs truncate">{discipline.description || "-"}</TableCell>
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
            <DisciplineDialog
                isOpen={dialogState.isOpenCreateOrEditDialog}
                onOpenChange={closeDialog}
                onSubmit={handleSaveDiscipline}
                initialData={dialogState.data}
            />

            {/* Delete Confirmation Dialog */}
            <DisciplineAlertDialog
                data={dialogState.data || null}
                isOpen={dialogState.isOpenDeleteDialog}
                onOpenChange={closeDialog}
                onConfirm={handleDeleteDiscipline}
            />
        </div>
    )
}

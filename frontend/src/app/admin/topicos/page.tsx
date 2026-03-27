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
import { useTopics } from '@/hooks/api/useTopics';
import { setDialog } from '@/lib/utils';
import { Topic, TopicFormData } from '@/lib/interface/ITopico';
import { TopicDialog } from './_ui/topicDialog';
import { TopicAlertDialog } from './_ui/topicAlertDialog';

export default function TopicosPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const [dialogState, setDialogState] = useState<{ isOpenCreateOrEditDialog: boolean; isOpenDeleteDialog: boolean; data?: Topic | null }>({
        isOpenCreateOrEditDialog: false,
        isOpenDeleteDialog: false,
        data: null,
    });

    const { toast } = useToast()
    const { useListTopics, useCreateTopic, useUpdateTopic, useDeleteTopic } = useTopics();

    const { data: dataTopics, isError, isLoading } = useListTopics({ page: 1, limit: 10, filter: searchQuery });
    const { mutate: createTopic } = useCreateTopic();
    const { mutate: updateTopic } = useUpdateTopic();
    const { mutate: deleteTopic } = useDeleteTopic();

    const handleSaveTopic = (data: TopicFormData) => {
        if (dialogState.data?._id) {
            updateTopic({ id: dialogState.data._id, payload: data });
            toast({ title: "Topico atualizada!", description: `A tópico "${data.name}" foi atualizada.` });
        }
        else {
            createTopic(data);
            toast({ title: "Topico criada!", description: `A tópico "${data.name}" foi criada.` });
        }
        closeDialog();
    };

    const handleDeleteTopic = () => {
        if (!dialogState.data?._id) return;
        deleteTopic(dialogState.data._id);
        toast({ title: "Topico excluída!", description: `A tópico foi removida.` });
        closeDialog();
    }

    const openCreateDialog = () => setDialogState(setDialog("createOrEdit", null));
    const openEditDialog = (topic: Topic) => setDialogState(setDialog("createOrEdit", topic));
    const openDeleteDialog = (topic: Topic) => setDialogState(setDialog("delete", topic));
    const closeDialog = () => setDialogState(setDialog("none", null));

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Gerenciar Topicos</CardTitle>
                    <CardDescription>Crie, edite e gerencie as tópicos do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Search and Create */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar tópicos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button className={'cursor-pointer'} onClick={openCreateDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nova Topico
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criada em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            Carregando tópicos...
                                        </TableCell>
                                    </TableRow>
                                ) : dataTopics?.total === 0 || !dataTopics?.items.length || isError ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {searchQuery ? "Nenhuma tópico encontrada" : "Nenhuma tópico cadastrada"}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    dataTopics?.items?.map((topic) => (
                                        <TableRow key={topic._id}>
                                            <TableCell className="font-medium">{topic.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={topic.active ? "default" : "secondary"}>
                                                    {topic.active ? "Ativa" : "Inativa"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(topic.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Hint label="Editar">
                                                        <Button className="cursor-pointer hover:text-white hover:bg-yellow-600" variant="outline" size="sm" onClick={() => openEditDialog(topic)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Hint>

                                                    <Hint label="Excluir" tone="destructive">
                                                        <Button className="cursor-pointer hover:text-white hover:bg-red-600" variant="outline" size="sm" onClick={() => openDeleteDialog(topic)}>
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
            <TopicDialog
                isOpen={dialogState.isOpenCreateOrEditDialog}
                onOpenChange={closeDialog}
                onSubmit={handleSaveTopic}
                initialData={dialogState.data}
            />

            {/* Delete Confirmation Dialog */}
            <TopicAlertDialog
                data={dialogState.data || null}
                isOpen={dialogState.isOpenDeleteDialog}
                onOpenChange={closeDialog}
                onConfirm={handleDeleteTopic}
            />
        </div>
    )
}

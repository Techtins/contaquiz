import { useEffect, useState } from "react"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Label } from "@/components/ui/atoms/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/atoms/dialog"
import { Switch } from "@/components/ui/atoms/switch"
import { Topic, TopicFormData } from "@/lib/interface/ITopico"
import { useDisciplines } from "@/hooks/api/useDisciplines"
import { useTopics } from "@/hooks/api/useTopics"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/atoms/select"
import { Discipline } from "@/lib/interface/IDisciplina"

interface TopicDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (data: TopicFormData) => void;
    initialData?: Topic | null;
}

const defaultFormData: TopicFormData = {
    name: "",
    disciplineId: "",
    parentTopicId: "",
    active: true,
}

export const TopicDialog = ({ isOpen, onOpenChange, onSubmit, initialData }: TopicDialogProps) => {
    const [formData, setFormData] = useState<TopicFormData>(defaultFormData);

    const { useListDisciplines } = useDisciplines();
    const { useListTopics } = useTopics();

    const { data: dataTopics } = useListTopics({ page: 1, limit: 0 });
    const { data: dataDisciplines } = useListDisciplines({ page: 1, limit: 0 });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name,
                disciplineId: initialData.disciplineId,
                parentTopicId: initialData.parentTopicId || "",
                active: initialData.active,
            });
        } else if (!isOpen) {
            setFormData(defaultFormData);
        }
    }, [initialData, isOpen]);

    const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    const isEditing = !!initialData;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Tópico" : "Criar Nova Tópico"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Altere os dados da tópico" : "Preencha os dados da nova tópico"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome do tópico"
                        />
                    </div>
                    <div>
                        <Label htmlFor="disciplineId">Disciplina</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, disciplineId: value as string })} defaultValue={formData.disciplineId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a disciplina" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataDisciplines?.items?.map((discipline: Discipline) => (
                                    <SelectItem key={discipline._id} value={discipline._id}>
                                        {discipline.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="parentTopicId">Tópico Pai</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, parentTopicId: value as string })} defaultValue={formData.parentTopicId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tópico pai" />
                            </SelectTrigger>
                            <SelectContent>
                                {dataTopics?.items?.map((topic: Topic) => (
                                    <SelectItem key={topic._id} value={topic._id}>
                                        {topic.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={formData.active}
                            onCheckedChange={(checked: boolean) => setFormData({ ...formData, active: checked })}
                        />
                        <Label htmlFor="active">Tópico ativa</Label>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 cursor-pointer">
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 cursor-pointer">
                            {isEditing ? "Salvar Alterações" : "Criar Tópico"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
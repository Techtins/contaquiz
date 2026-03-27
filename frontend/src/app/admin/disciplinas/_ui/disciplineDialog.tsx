import { useEffect, useState } from "react"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Label } from "@/components/ui/atoms/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/atoms/dialog"
import { Textarea } from "@/components/ui/atoms/textarea"
import { Switch } from "@/components/ui/atoms/switch"
import { Discipline, DisciplineFormData } from "@/lib/interface/IDisciplina"

interface DisciplineDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (data: DisciplineFormData) => void;
    initialData?: Discipline | null;
}

const defaultFormData: DisciplineFormData = {
    name: "",
    description: "",
    active: true
}

export const DisciplineDialog = ({ isOpen, onOpenChange, onSubmit, initialData }: DisciplineDialogProps) => {
    const [formData, setFormData] = useState<DisciplineFormData>(defaultFormData);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description || "",
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
                    <DialogTitle>{isEditing ? "Editar Disciplina" : "Criar Nova Disciplina"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Altere os dados da disciplina" : "Preencha os dados da nova disciplina"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome da disciplina"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descrição da disciplina (opcional)"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={formData.active}
                            onCheckedChange={(checked: boolean) => setFormData({ ...formData, active: checked })}
                        />
                        <Label htmlFor="active">Disciplina ativa</Label>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 cursor-pointer">
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 cursor-pointer">
                            {isEditing ? "Salvar Alterações" : "Criar Disciplina"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
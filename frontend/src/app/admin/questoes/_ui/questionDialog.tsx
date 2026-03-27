import { useEffect, useState } from "react"
import { Button } from "@/components/ui/atoms/button"
import { Input } from "@/components/ui/atoms/input"
import { Label } from "@/components/ui/atoms/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/atoms/dialog"
import { Textarea } from "@/components/ui/atoms/textarea"
import { Switch } from "@/components/ui/atoms/switch"
import { DifficultyLevel, Question, QuestionFormData, QuestionType } from "@/lib/interface/IQuestao"
import { Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/atoms/select"
import { useDisciplines } from "@/hooks/api/useDisciplines"
import { Discipline } from "@/lib/interface/IDisciplina"
// import { useTopics } from "@/hooks/api/useTopics"

interface QuestionDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (data: QuestionFormData) => void;
    initialData?: Question | null;
}

const defaultFormData: QuestionFormData = {
    statement: "",
    options: [{ text: "", isCorrect: false }],
    type: QuestionType.MULTIPLA_ESCOLHA,
    difficulty: DifficultyLevel.FACIL,
    disciplineId: "",
    topicIds: [],
    active: true,
}

export function QuestionDialog({ isOpen, onOpenChange, onSubmit, initialData }: QuestionDialogProps) {
    const [formData, setFormData] = useState<QuestionFormData>(defaultFormData);

    const { useListDisciplines } = useDisciplines();
    // const { useListTopics } = useTopics();

    // const { data: dataTopics } = useListTopics({ page: 1, limit: 0 });
    const { data: dataDisciplines } = useListDisciplines({ page: 1, limit: 0 });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                statement: initialData.statement,
                options: initialData.options,
                type: initialData.type,
                difficulty: initialData.difficulty,
                disciplineId: initialData.disciplineId,
                topicIds: initialData.topicIds,
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

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index].text = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleCorrectOptionChange = (index: number, isCorrect: boolean) => {
        const newOptions = formData.options.map((option, i) => ({
            ...option,
            isCorrect: i === index ? isCorrect : false,
        }));
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { text: "", isCorrect: false }],
        });
    };

    const removeOption = (index: number) => {
        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const isEditing = !!initialData;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Questão" : "Criar Nova Questão"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Altere os dados da questão" : "Preencha os dados da nova questão"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {/* Enunciado */}
                    <div>
                        <Label htmlFor="statement">Enunciado *</Label>
                        <Textarea
                            id="statement"
                            value={formData.statement}
                            onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                            placeholder="Digite o enunciado da questão"
                            required
                        />
                    </div>

                    {/* Alternativas */}
                    <div>
                        <Label>Alternativas *</Label>
                        <div className="space-y-2">
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Switch
                                        checked={option.isCorrect}
                                        onCheckedChange={(checked) => handleCorrectOptionChange(index, checked)}
                                        aria-label={`Marcar como correta a opção ${index + 1}`}
                                    />
                                    <Input
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Alternativa ${index + 1}`}
                                        required
                                    />
                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeOption(index)} disabled={formData.options.length <= 1}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
                            Adicionar Alternativa
                        </Button>
                    </div>

                    {/* Disciplina e Tópicos */}
                    <div>
                        <Label htmlFor="disciplineId">Disciplina da Questão *</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, disciplineId: value })} defaultValue={formData.disciplineId}>
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

                    {/* Dificuldade e Tipo */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="difficulty">Dificuldade</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, difficulty: value as DifficultyLevel })} defaultValue={formData.difficulty}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a dificuldade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(DifficultyLevel).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="type">Tipo</Label>
                            <Select onValueChange={(value) => setFormData({ ...formData, type: value as QuestionType })} defaultValue={formData.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(QuestionType).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Ativo/Inativo */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={formData.active}
                            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                        />
                        <Label htmlFor="active">Questão ativa</Label>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1">
                            {isEditing ? "Salvar Alterações" : "Criar Questão"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
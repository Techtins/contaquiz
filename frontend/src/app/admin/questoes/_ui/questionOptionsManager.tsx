import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { QuestionOption } from "@/lib/interface/IQuestao";
import { Switch } from "@radix-ui/react-switch";
import { Trash2 } from "lucide-react";
import React from "react";

interface QuestionOptionsManagerProps {
    options: QuestionOption[];
    onOptionsChange: (options: QuestionOption[]) => void;
}

export function QuestionOptionsManager({
    options,
    onOptionsChange
}: QuestionOptionsManagerProps) {

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        onOptionsChange(newOptions);
    };

    const handleCorrectOptionChange = (index: number, isCorrect: boolean) => {
        const newOptions = options.map((option, i) => ({
            ...option,
            isCorrect: i === index ? isCorrect : false,
        }));
        onOptionsChange(newOptions);
    };

    const addOption = () => {
        onOptionsChange([...options, { text: "", isCorrect: false }]);
    };

    const removeOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        onOptionsChange(newOptions);
    };

    return (
        <div>
            <Label>Alternativas *</Label>
            <div className="space-y-2">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Switch
                            checked={option.isCorrect}
                            onCheckedChange={(checked: boolean) => handleCorrectOptionChange(index, checked)}
                            aria-label={`Marcar como correta a opção ${index + 1}`}
                        />
                        <Input
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Alternativa ${index + 1}`}
                            required
                        />
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeOption(index)} disabled={options.length <= 1}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
                Adicionar Alternativa
            </Button>
        </div>
    );
}

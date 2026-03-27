'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/atoms/alertDialog";
import { Quiz } from "@/lib/interface/IQuiz";

interface QuizAlertDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    data: Quiz | null;
}

export function QuizAlertDialog({ isOpen, onOpenChange, onConfirm, data }: QuizAlertDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Quiz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir o quiz "<strong>{data?.title}</strong>"? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-2 justify-end">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
                        Excluir
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

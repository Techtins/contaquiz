import { ListParams } from "./IDefault";
import { Question } from "./IQuestao";

export interface Quiz {
    _id: string;
    title: string;
    description?: string;
    disciplineId: string;
    questions: Question[];
    timeLimit: number; // em segundos
    passingScore: number; // percentual (0-100)
    active: boolean;
    visibility?: 'PUBLIC' | 'PRIVATE';
    createdAt: string;
    updatedAt: string;
}

export interface QuizFormData {
    title: string;
    description?: string;
    disciplineId: string;
    questions: string[]; // IDs das questões
    timeLimit: number;
    passingScore: number;
    active: boolean;
    visibility?: 'PUBLIC' | 'PRIVATE';
}

export interface QuizListParams extends ListParams {
    disciplineId?: string;
}

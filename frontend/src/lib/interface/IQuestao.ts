import { ListParams } from "./IDefault";

export enum DifficultyLevel {
    FACIL = "FACIL",
    MEDIO = "MEDIO",
    DIFICIL = "DIFICIL",
}

export enum QuestionType {
    MULTIPLA_ESCOLHA = "MULTIPLA_ESCOLHA",
    CERTO_ERRADO = "CERTO_ERRADO",
}

export interface QuestionOption {
    text: string;
    isCorrect: boolean;
}

export interface Question {
    _id: string;
    statement: string;
    type: QuestionType;
    disciplineId?: string;
    topicIds?: string[];
    difficulty: DifficultyLevel;
    options: QuestionOption[];
    explanation?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface QuestionFormData {
    statement: string;
    type: QuestionType;
    disciplineId?: string;
    topicIds?: string[];
    difficulty: DifficultyLevel;
    options: QuestionOption[];
    explanation?: string;
    active: boolean;
}

export interface QuestionListParams extends ListParams {
    disciplineId?: string;
    topicIds?: string[];
    difficulty?: DifficultyLevel;
    type?: QuestionType;
}

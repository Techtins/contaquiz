import { Schema, model, models, Types } from "mongoose";

export interface IQuestionOption {
    _id: Types.ObjectId;
    text: string;          // texto/HTML do item
    isCorrect: boolean;    // marca a(s) correta(s)
    // futuramente: letter?: 'A'|'B'|...
}

export enum DifficultyLevel {
    FACIL = "FACIL",
    MEDIO = "MEDIO",
    DIFICIL = "DIFICIL",
}

export enum QuestionType {
    MULTIPLA_ESCOLHA = "MULTIPLA_ESCOLHA",
    CERTO_ERRADO = "CERTO_ERRADO",
}

export interface IQuestion {
    _id: Types.ObjectId;
    statement: string;                 // enunciado string
    type: QuestionType;                // multipla escolha | certo/errado
    disciplineId: Types.ObjectId;      // classificação
    topicIds: Types.ObjectId[];        // temas/subtemas
    difficulty: DifficultyLevel;       // Fácil/Médio/Difícil
    options: IQuestionOption[];        // alternativas (inclusive para certo/errado)
    explanation?: string;              // justificativa da correta
    // attachments?: IQuestionAttachment[];
    active: boolean;

    // Estatísticas básicas de uso
    stats: {
        timesAnswered: number;
        timesCorrect: number;
    };

    createdAt: Date;
    updatedAt: Date;
}

const QuestionOptionSchema = new Schema<IQuestionOption>(
    {
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
    },
    { _id: true }
);

// const QuestionAttachmentSchema = new Schema<IQuestionAttachment>(
//     {
//         kind: { type: String, enum: ["IMAGE", "FILE", "MATH"], required: true },
//         url: { type: String, required: true },
//         caption: { type: String },
//     },
//     { _id: false }
// );

const QuestionSchema = new Schema<IQuestion>(
    {
        statement: { type: String, required: true },
        type: { type: String, enum: Object.values(QuestionType), required: true },
        disciplineId: { type: Schema.Types.ObjectId, ref: "Discipline" },
        topicIds: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
        difficulty: { type: String, enum: Object.values(DifficultyLevel), default: DifficultyLevel.MEDIO, required: true },
        options: { type: [QuestionOptionSchema], validate: (arr: any[]) => Array.isArray(arr) && arr.length >= 2 },
        explanation: { type: String },
        // attachments: [QuestionAttachmentSchema],
        active: { type: Boolean, default: true },
        stats: {
            timesAnswered: { type: Number, default: 0 },
            timesCorrect: { type: Number, default: 0 },
        },
    },
    { timestamps: true, versionKey: false }
);

// buscas rápidas por filtros do gerador de quiz
QuestionSchema.index({ disciplineId: 1, difficulty: 1, active: 1 });
QuestionSchema.index({ topicIds: 1 });
QuestionSchema.index({ "stats.timesAnswered": -1 });

export default models.Question || model<IQuestion>("Question", QuestionSchema);

import { Schema, model, models, Types } from "mongoose";
import { DifficultyLevel } from "./Questao";

export interface IQuizConfig {
    disciplineId?: Types.ObjectId | null;
    topicId?: Types.ObjectId | null;
    difficulty?: DifficultyLevel | null;
    numberOfQuestions: number;
    timeLimitSeconds?: number | null;
}

export interface IAnswer {
    questionId: Types.ObjectId;
    selectedOptionIds?: Types.ObjectId[]; // múltipla escolha
    selectedBoolean?: boolean | null;     // certo/errado (alternativa ao selectedOptionIds)
    correctOptionIds: Types.ObjectId[];   // snapshot da correta
    isCorrect: boolean;
    timeSpentSeconds?: number;
}

export interface IScore {
    totalQuestions: number;
    totalCorrect: number;
    percentage: number; // 0..100
    totalTimeSeconds?: number;
}

export interface IQuizAttempt {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    config: IQuizConfig;
    questionIds: Types.ObjectId[];
    status: boolean;
    answers: IAnswer[];
    score?: IScore;
    startedAt?: Date;
    finishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
    {
        questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
        selectedOptionIds: [{ type: Schema.Types.ObjectId }],
        selectedBoolean: { type: Boolean, default: null },
        correctOptionIds: [{ type: Schema.Types.ObjectId, required: true }],
        isCorrect: { type: Boolean, required: true },
        timeSpentSeconds: { type: Number },
    },
    { _id: false }
);

const QuizAttemptSchema = new Schema<IQuizAttempt>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        config: {
            disciplineId: { type: Schema.Types.ObjectId, ref: "Discipline", default: null },
            topicId: { type: Schema.Types.ObjectId, ref: "Topic", default: null },
            difficulty: { type: String, enum: Object.values(DifficultyLevel), default: null },
            numberOfQuestions: { type: Number, required: true, min: 1 },
            timeLimitSeconds: { type: Number, default: null },
        },
        questionIds: [{ type: Schema.Types.ObjectId, ref: "Question", required: true }],
        status: { type: Boolean, default: false},
        answers: { type: [AnswerSchema], default: [] },
        score: {
            totalQuestions: Number,
            totalCorrect: Number,
            percentage: Number,
            totalTimeSeconds: Number,
        },
        startedAt: Date,
        finishedAt: Date,
    },
    { timestamps: true, versionKey: false }
);

QuizAttemptSchema.index({ "config.mode": 1, createdAt: -1 });
QuizAttemptSchema.index({ "config.disciplineId": 1 });
QuizAttemptSchema.index({ "config.topicId": 1 });
QuizAttemptSchema.index({ "config.difficulty": 1 });

export default models.QuizAttempt || model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);

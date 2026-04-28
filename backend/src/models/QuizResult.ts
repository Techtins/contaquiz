import { Schema, model, models, Types } from 'mongoose';

export interface IQuizCorrection {
    questionId: Types.ObjectId;
    userAnswer: number | null;
    correctAnswer: number;
    isCorrect: boolean;
    explanation?: string;
}

export interface IQuizResult {
    _id: Types.ObjectId;
    quizId: Types.ObjectId;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
    percentage: number;
    timeSpentInSeconds: number;
    passingScore: number;
    corrections: IQuizCorrection[];
    createdAt: Date;
    updatedAt: Date;
}

const QuizCorrectionSchema = new Schema<IQuizCorrection>(
    {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        userAnswer: { type: Number, default: null },
        correctAnswer: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
        explanation: { type: String },
    },
    { _id: false }
);

const QuizResultSchema = new Schema<IQuizResult>(
    {
        quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
        correctAnswers: { type: Number, required: true },
        wrongAnswers: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        percentage: { type: Number, required: true },
        timeSpentInSeconds: { type: Number, required: true },
        passingScore: { type: Number, required: true },
        corrections: { type: [QuizCorrectionSchema], default: [] },
    },
    { timestamps: true, versionKey: false }
);

export default models.QuizResult || model<IQuizResult>('QuizResult', QuizResultSchema);

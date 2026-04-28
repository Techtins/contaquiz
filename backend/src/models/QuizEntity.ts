import { Schema, model, models, Types } from 'mongoose';

export interface IQuiz {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    disciplineId?: Types.ObjectId | null;
    questionIds: Types.ObjectId[];
    timeLimitSeconds?: number | null; // tempo limite em segundos
    score: number; // pontuação total (int)
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
    {
        title: { type: String, required: true },
        description: { type: String },
        disciplineId: { type: Schema.Types.ObjectId, ref: 'Discipline', default: null },
        questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
        timeLimitSeconds: { type: Number, default: null },
        score: { type: Number, required: true, default: 0 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);

QuizSchema.index({ disciplineId: 1 });

export default models.Quiz || model<IQuiz>('Quiz', QuizSchema);

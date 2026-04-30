import { Schema, model, models, Types } from 'mongoose';

export interface IQuiz {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    disciplineId?: Types.ObjectId | null;
    questionIds: Types.ObjectId[];
    timeLimitSeconds?: number | null; // tempo limite em segundos
    score: number; // pontuação total (int)
    visibility: QuizVisibility;
    createdByUserId?: Types.ObjectId | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export enum QuizVisibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

const QuizSchema = new Schema<IQuiz>(
    {
        title: { type: String, required: true },
        description: { type: String },
        disciplineId: { type: Schema.Types.ObjectId, ref: 'Discipline', default: null },
        questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
        timeLimitSeconds: { type: Number, default: null },
        score: { type: Number, required: true, default: 0 },
        visibility: { type: String, enum: Object.values(QuizVisibility), default: QuizVisibility.PUBLIC, required: true },
        createdByUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        active: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);

QuizSchema.index({ disciplineId: 1 });
QuizSchema.index({ visibility: 1, createdByUserId: 1, active: 1 });

export default models.Quiz || model<IQuiz>('Quiz', QuizSchema);

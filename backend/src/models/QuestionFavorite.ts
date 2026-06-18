import { Schema, model, models, Types } from 'mongoose';

export interface IQuestionFavorite {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    questionId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionFavoriteSchema = new Schema<IQuestionFavorite>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    },
    { timestamps: true, versionKey: false }
);

QuestionFavoriteSchema.index({ userId: 1, questionId: 1 }, { unique: true });
QuestionFavoriteSchema.index({ userId: 1, createdAt: -1 });

export default models.QuestionFavorite || model<IQuestionFavorite>('QuestionFavorite', QuestionFavoriteSchema);
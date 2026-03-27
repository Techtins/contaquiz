import { Schema, model, models, Types } from "mongoose";

export interface ITopic {
    _id: Types.ObjectId;
    disciplineId: Types.ObjectId;
    name: string;
    parentTopicId?: Types.ObjectId | null; // quando presente, atua como Subtema
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
    {
        disciplineId: { type: Schema.Types.ObjectId, ref: "Discipline", required: true },
        name: { type: String, required: true, trim: true },
        parentTopicId: { type: Schema.Types.ObjectId, ref: "Topic", default: null },
        active: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);

TopicSchema.index({ disciplineId: 1, parentTopicId: 1, name: 1 }, { unique: true });

export default models.Topic || model<ITopic>("Topic", TopicSchema);

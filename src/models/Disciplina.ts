import { Schema, model, models, Types } from "mongoose";

export interface IDiscipline {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DisciplineSchema = new Schema<IDiscipline>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String },
        active: { type: Boolean, default: true },
    },
    { timestamps: true, versionKey: false }
);

DisciplineSchema.index({ name: 1 }, { unique: true });

export default models.Discipline || model<IDiscipline>("Discipline", DisciplineSchema);

import { Schema, model, models, Types } from "mongoose";

export enum UserSystemRole {
    ADMIN = "ADMIN",
    ALUNO = "ALUNO",
}

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string; // criptografado
    systemRole: UserSystemRole; // ADMIN/ALUNO
    roles: Types.ObjectId[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        systemRole: {
            type: String,
            enum: Object.values(UserSystemRole),
            default: UserSystemRole.ALUNO,
            required: true,
        },
        roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
        active: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false }
);

UserSchema.index({ email: 1 }, { unique: true });

export default models.User || model<IUser>("User", UserSchema);

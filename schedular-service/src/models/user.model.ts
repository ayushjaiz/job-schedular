import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAvailableTimeSlot {
    start: string;
    end: string;
}

export interface IUser {
    email: string;
    password: string;
    role?: string;
}

export interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
}

const UserSchema = new Schema<IUserDocument>(
    {
        email: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            type: Schema.Types.String,
            required: true,
            minlength: 6,
        },
        role: {
            type: Schema.Types.String,
            enum: Object.values(Role),
            default: Role.USER,
        },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

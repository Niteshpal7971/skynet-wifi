import mongoose, { Document, Schema, Model } from "mongoose";

export type userRole = 'user' | 'admin'

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    role: userRole;
    isAdmin: Boolean;
    isVerified: Boolean;
    verifyToken: string | undefined;
    verifyTokenExpiry: Date | undefined;
    forgotPasswordToken: string;
    forgotPasswordTokenExpiry: Date;
}

const userSchema: Schema<IUser> = new Schema({
    userName: {
        type: String,
        required: [true, "please provide a userName"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please Provide a password"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyToken: {
        type: String,
        default: null
    },
    verifyTokenExpiry: {
        type: Date,
        default: null
    },
    forgotPasswordToken: {
        type: String,
        default: null
    },
    forgotPasswordTokenExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
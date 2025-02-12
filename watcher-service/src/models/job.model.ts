import mongoose, { Document, Schema } from "mongoose";

export enum JobStatus {
    COMPLETED = "DELIVERED",
    PENDING = "PENDING",
    FAILED = "FAILED",
    RUNNING = "RUNNING"
}

export interface IJob {
    user_id: mongoose.Types.ObjectId;
    status: JobStatus;
    retries_left: number;
    scheduled_time: Date;
    email_id: string;
    body: string;
    subject: string;
}

export interface IJobDocument extends IJob, Document { }

const JobSchema = new Schema<IJobDocument>(
    {
        user_id:
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        status: {
            type: String,
            enum: Object.values(JobStatus),
            required: true,
            default: JobStatus.PENDING,
        },
        retries_left: {
            type: Number,
            required: true,
            default: 3, // default retry count
        },
        scheduled_time: {
            type: Date,
            required: true,
        },
        email_id: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        subject:
        {
            type: Schema.Types.String,
            required: true,
        },
        body:
        {
            type: Schema.Types.String,
            required: true,
        },
    },
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const JobModel = mongoose.model<IJobDocument>("Job", JobSchema);

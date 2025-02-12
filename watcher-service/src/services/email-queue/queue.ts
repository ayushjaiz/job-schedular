import { Queue, JobsOptions } from "bullmq";
import { redis } from "../../config/redis";
import { emailPayload } from "../mail/send-email";

const emailQueue = new Queue("email-queue", {
    connection: redis.duplicate(),
});

emailQueue.on("error", (err: Error) => {
    console.error("Queue Error:", err.message);
});

const getEmailQueueOptions = (): JobsOptions => {
    return {
        removeOnComplete: {
            age: 3600, // Keep completed jobs for 1 hour
            count: 1000, // Keep up to 1000 completed jobs
        },
        removeOnFail: {
            age: 24 * 3600, // Keep failed jobs for 24 hours
        },
    };
};

export interface JobPayload extends emailPayload {
    job_id: string;
}

const addEmailToQueue = async (payload: JobPayload) => {
    try {
        const job = await emailQueue.add("email", payload, getEmailQueueOptions());
        console.log(`Email job added successfully! Job ID: ${job.id} with payload- ${payload}`);
        return job;
    } catch (error) {
        console.error(`Failed to add email job:`, error);
        throw error;
    }
};

export { addEmailToQueue };
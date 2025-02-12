import { Worker, QueueEvents } from "bullmq";
import { redis } from "../../config/redis";
import { sendEmail } from "../mail/send-email";
import { JobModel, JobStatus } from "../../models/job.model";
import { JobPayload } from "./queue";

const emailQueueEvents = new QueueEvents("email-queue", {
    connection: redis.duplicate(),
});

export const initializeWorker = () => {
    const emailWorker = new Worker(
        "email-queue",
        async (job) => {
            try {
                const { job_id, email_id, subject, body }: JobPayload = job?.data;

                await sendEmail({ email_id, subject, body });

                const jobDoc = await JobModel.findById(job_id);
                if (jobDoc) {
                    // Mark the job as completed.
                    jobDoc.status = JobStatus.COMPLETED;
                    await jobDoc.save();
                }

                console.log(`Email sent successfully to ${email_id}`);
            } catch (err) {
                const jobDoc = await JobModel.findById(job.data.job_id);
                if (jobDoc) {
                    if (jobDoc.retries_left > 0) {
                        jobDoc.retries_left -= 1;
                        console.log(
                            `Retrying job ${job.data.job_id}. Retries left: ${jobDoc.retries_left}`
                        );
                    } else {
                        // No retries left; mark the job as failed.
                        jobDoc.status = JobStatus.FAILED;
                        console.log(`Job ${job.data.job_id} marked as FAILED.`);
                    }
                    await jobDoc.save();
                }
                throw err;
            }
        },
        {
            connection: redis.duplicate(),
        }
    );

    // Handle queue events
    emailQueueEvents.on("completed", ({ jobId }) => {
        console.log(`🎉 Job Completed: ${jobId}`);
    });

    emailQueueEvents.on("failed", ({ jobId, failedReason }) => {
        console.error(`⚠️ Job Failed: ${jobId}, Reason: ${failedReason}`);
    });
};

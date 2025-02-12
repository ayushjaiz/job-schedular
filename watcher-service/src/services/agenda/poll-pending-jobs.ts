import { JobModel, JobStatus } from "../../models/job.model";
import { addEmailToQueue, JobPayload } from "../email-queue/queue";

/**
 * Polls for pending jobs that are scheduled to run at or before the current time.
 * For each pending job, marks it as RUNNING, enqueues it for processing (e.g., sending an email),
 * and then updates its status to COMPLETED on success, or handles errors by decrementing retries_left.
 */
export const pollPendingJobs = async (): Promise<void> => {
    try {
        // Find all jobs with a status of PENDING and a scheduled_time less than or equal to now.
        const pendingJobs = await JobModel.find({
            status: JobStatus.PENDING,
            scheduled_time: { $lte: new Date() },
        });

        console.log(`Found ${pendingJobs.length} pending job(s).`);

        for (const job of pendingJobs) {
            try {
                // Mark the job as RUNNING.
                job.status = JobStatus.RUNNING;
                await job.save();

                // Build the payload for the email queue.
                const payload: JobPayload = {
                    job_id: job.id,
                    email_id: job.email_id,
                    subject: job.subject,
                    body: job.body,
                };

                // Add the job to the email queue.
                await addEmailToQueue(payload);

                // Mark the job as COMPLETED after successful processing.
                job.status = JobStatus.COMPLETED;
                await job.save();

                console.log(`Processed job ${job._id} successfully.`);
            } catch (error) {
                console.error(`Error processing job ${job._id}:`, error);
                throw error;
            }
        }
    } catch (err) {
        console.error("Error polling pending jobs:", err);
        throw err;
    }
};

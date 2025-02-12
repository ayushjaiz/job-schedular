import { Request, Response } from "express";
import { JobModel, JobStatus } from "../models/job.model";

export const createJob = async (req: Request, res: Response) => {
    try {
        const user_id = req?.user?.id;
        const { retries, scheduled_time, email_id, subject, body } = req.body;

        console.log('User id', user_id)

        if (!scheduled_time || !email_id || !subject || !body) {
            res.status(400).json({
                message: "Scheduled_time is required.",
            });
            return;
        }

        // Convert scheduled_time to a Date object
        const scheduledTimeDate = new Date(scheduled_time);
        const currentTime = new Date();

        // Check if scheduled time is in the future
        if (scheduledTimeDate <= currentTime) {
            res.status(400).json({
                message: "Scheduled_time must be a future date and time.",
            });
            return;
        }

        const newJob = new JobModel({
            user_id,
            status: JobStatus.PENDING,
            retries_left: retries !== undefined ? retries : 3,
            scheduled_time,
            email_id,
            subject,
            body
        });

        const savedJob = await newJob.save();

        res.send({ status: true, message: 'Job scheduled sucessfully', job: savedJob });

    } catch (error: any) {
        console.error("Error creating job:", error);
        res.status(500).send({
            status: false,
            error: error.message,
        });
    }
};

export const getUserJobs = async (req: Request, res: Response) => {
    try {
        const user_id = req?.user?.id;
        console.log('User id', user_id);
        const jobs = await JobModel.find({ user_id }, { retries_left: 0 });
        res.status(200).send({ status: true, message: "Jobs fetched successfully", jobs: jobs });
    } catch (error: any) {
        console.error("Error retrieving jobs:", error);
        res.status(500).send({
            status: false,
            error: error.message,
        });
    }
};

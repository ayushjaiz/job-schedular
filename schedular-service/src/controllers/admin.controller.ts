import { Request, Response } from "express";
import { Role, UserModel } from "../models/user.model";
import { JobModel } from "../models/job.model";

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;
        const { role } = req.body;

        if (!Object.values(Role).includes(role)) {
            res.status(400).send({ status: false, error: "Invalid role" });
            return;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(user_id, { role }, { new: true });

        if (!updatedUser) {
            res.status(404).send({ status: false, message: "User not found" });
            return;
        }

        res.send({
            status: true,
            message: "User role updated successfully",
            data: updatedUser,
        });
    } catch (error: any) {
        res.status(400).send({ status: false, error: error.message });
    }
}


export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await JobModel.find({});
        res.status(200).send({ status: true, message: "Jobs fetched successfully", jobs: jobs });
    } catch (error: any) {
        console.error("Error retrieving jobs:", error);
        res.status(500).send({
            status: false,
            error: error.message,
        });
    }
};



import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { createJob, getUserJobs } from "../controllers/user.controller";
import { createJobValidator } from "../utils/validators/create_job";

const router = express.Router();

router.post("/jobs", authenticate, createJobValidator, createJob);
router.get("/jobs", authenticate, getUserJobs);


export default router;

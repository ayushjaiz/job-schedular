import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { Role } from "../models/user.model";
import { updateRole, getAllJobs } from "../controllers/admin.controller";

const router = express.Router();

router.patch(
    "/users/:user_id/role",
    authenticate,
    authorize([Role.ADMIN]),
    updateRole
);

router.get(
    "/jobs",
    authenticate,
    authorize([Role.ADMIN]),
    getAllJobs
);

export default router;

import { Request, Response, NextFunction } from "express";

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ status: "false", message: "Unauthorized: No user found" });
            return;
        }

        // Check if the user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ status: "false", message: "Forbidden: Insufficient permissions" });
            return;
        }

        next();
    };
};
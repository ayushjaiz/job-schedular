import { body } from "express-validator";

export const createJobValidator = [
    body("scheduled_time")
        .notEmpty()
        .withMessage("Scheduled time is required.")
        .isISO8601()
        .withMessage("Scheduled time must be a valid date (ISO8601 format)."),

    body("email_id")
        .notEmpty()
        .withMessage("Email ID is required.")
        .isEmail()
        .withMessage("Email ID must be a valid email address."),

    body("subject")
        .notEmpty()
        .withMessage("Subject is required.")
        .isString()
        .withMessage("Subject must be a string."),

    body("body")
        .notEmpty()
        .withMessage("Email body is required.")
        .isString()
        .withMessage("Email body must be a string."),
];

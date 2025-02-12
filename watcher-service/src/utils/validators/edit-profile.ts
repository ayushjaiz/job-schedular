import { body } from "express-validator";

export const updateProfileValidator = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string."),

    body("mobile_number")
        .notEmpty()
        .optional()
        .isString()
        .withMessage("Mobile number must be a string.")
        .matches(/^\d{10}$/)
        .withMessage("Mobile number must be a valid 10-digit number."),

    body("bio")
        .optional()
        .isString()
        .withMessage("Bio must be a string."),

    body("availability_time")
        .optional()
        .isArray()
        .withMessage("Availability time must be an array of time slots.")
        .custom((value) => {
            if (!value.every((slot: any) => /^([01]\d|2[0-3]):[0-5]\d - ([01]\d|2[0-3]):[0-5]\d$/.test(slot))) {
                throw new Error("Each time slot must be in the format HH:mm - HH:mm (24-hour format).");
            }
            return true;
        }),
];

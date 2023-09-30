const { check } = require("express-validator");

export const createValidators = [check("email").isEmail().withMessage("Enter a valid email address"), check("role").not().isEmpty()];

export const updateValidators = [check("userId").not().isEmpty().withMessage("User is required")];

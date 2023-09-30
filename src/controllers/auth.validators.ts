const { check } = require("express-validator");

export const registerValidators = [
  check("email").isEmail().withMessage("Enter a valid email address"),
  check("password").not().isEmpty().isLength({ min: 6 }).withMessage("Password must be at least 6 chars long"),
];

export const loginValidators = [
  check("email").isEmail().withMessage("Enter a valid email address"),
  check("password").not().isEmpty().withMessage("Password is required"),
];

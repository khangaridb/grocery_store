import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const init = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).array();
  if (errors.length > 0) {
    const error = errors[0];

    return res.status(400).json({ error: error.msg });
  }

  next();
};

export default init;

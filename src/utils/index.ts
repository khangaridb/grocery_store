import { NextFunction, Request, Response } from "express";

export const wrapExceptionHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err) {
    return res.status(500).send(err.message ? `${err.message}` : `Unexpected Error`);
  }
};

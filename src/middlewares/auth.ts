import { NextFunction, Request, Response } from "express";
import { UserTypes } from "../common/constants";
import passport from "passport";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", (err: Error, user: { _id: string; role: UserTypes }) => {
    if (err) return next(err);

    if (!user) return res.status(401).json({ message: "Unauthorized Access" });

    req.user = user;

    next();
  })(req, res, next);
};

export default checkAuth;

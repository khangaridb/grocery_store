import { Request } from "express";
import { UserTypes } from "../common/constants";
import { UserType } from "../models/user";

const checkIfUserIsManager = (req: Request) => {
  if ((req.user as UserType)?.role !== UserTypes.MANAGER) {
    throw new Error("The endpoint requires specific permission");
  }
};

export { checkIfUserIsManager };

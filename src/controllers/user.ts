import { Router } from "express";
import { Request, Response } from "express";
import { userService } from "../services";

import validate from "../middlewares/param-validate";
import * as permissionUtils from "../utils/permission";
import { createValidators, updateValidators } from "./user.validators";
import { UserTypes } from "../common/constants";

const router = Router();

type GetUsersByBuildingIdReq = Request & {
  query: {
    buildingId: string;
    includeDescendant: boolean;
  };
};

router.post("/create", createValidators, validate, async (req: Request, res: Response) => {
  await permissionUtils.checkIfUserIsManager(req);

  const user = await userService.createUser(req.body);

  return res.json({ ...user });
});

router.post("/update", updateValidators, validate, async (req: Request, res: Response) => {
  await permissionUtils.checkIfUserIsManager(req);

  const { userId, ...args } = req.body;
  const user = await userService.updateUser(userId, args);

  return res.json({ ...user });
});

router.post("/remove", updateValidators, validate, async (req: Request, res: Response) => {
  await permissionUtils.checkIfUserIsManager(req);

  const { userId } = req.body;
  const user = await userService.removeUser(userId);

  return res.json({ ...user });
});

router.get("/getEmplooyees", async (req: GetUsersByBuildingIdReq, res: Response) => {
  const { buildingId, includeDescendant } = req.query;

  const result = await userService.getUsersByBuildingId(buildingId, UserTypes.EMPLOYEE, includeDescendant);

  return res.json({ result });
});

router.get("/getManagers", async (req: GetUsersByBuildingIdReq, res: Response) => {
  await permissionUtils.checkIfUserIsManager(req);

  const { buildingId, includeDescendant } = req.query;

  const result = await userService.getUsersByBuildingId(buildingId, UserTypes.MANAGER, includeDescendant);

  return res.json({ result });
});

export default router;

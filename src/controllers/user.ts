import { Request, Response, Router, NextFunction } from "express";
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

router.post("/create", createValidators, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await permissionUtils.checkIfUserIsManager(req);

    const user = await userService.createUser(req.body);

    return res.json({ result: user });
  } catch (err) {
    next(err);
  }
});

router.post("/update", updateValidators, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await permissionUtils.checkIfUserIsManager(req);

    const { userId, ...args } = req.body;
    const user = await userService.updateUser(userId, args);

    return res.json({ result: user });
  } catch (err) {
    next(err);
  }
});

router.post("/remove", updateValidators, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await permissionUtils.checkIfUserIsManager(req);

    const { userId } = req.body;
    await userService.removeUser(userId);

    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.get("/getEmplooyees", async (req: GetUsersByBuildingIdReq, res: Response, next: NextFunction) => {
  try {
    const { buildingId, includeDescendant } = req.query;

    const result = await userService.getUsersByBuildingId(buildingId, UserTypes.EMPLOYEE, includeDescendant);

    return res.json({ result });
  } catch (err) {
    next(err);
  }
});

router.get("/getManagers", async (req: GetUsersByBuildingIdReq, res: Response, next: NextFunction) => {
  try {
    await permissionUtils.checkIfUserIsManager(req);

    const { buildingId, includeDescendant } = req.query;

    const result = await userService.getUsersByBuildingId(buildingId, UserTypes.MANAGER, includeDescendant);

    return res.json({ result });
  } catch (err) {
    next(err);
  }
});

export default router;

import express from "express";

import userRoutes from "./user";
import authRoutes from "./auth";

import checkAuth from "../middlewares/auth";

const router = express.Router();

router.use("/user", checkAuth, userRoutes);
router.use("/auth", authRoutes);

export default router;

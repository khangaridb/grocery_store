import { Router } from "express";
import { userService } from "../services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validate from "../middlewares/param-validate";
import { registerValidators, loginValidators } from "./auth.validators";
import { Request, Response } from "express";

const router = Router();

router.use("/register", registerValidators, validate, async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userService.registerUser({
    email,
    password: hashedPassword,
  });

  return res.status(201).json({ message: "User registered successfully", user });
});

router.use("/login", loginValidators, validate, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user?.password);

  if (!passwordMatch) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET ?? "");

  return res.json({ message: "Logged in successfully", token });
});

export default router;

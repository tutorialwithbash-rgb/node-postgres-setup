import { Router } from "express";
import { login } from "../controllers/auth.Controller";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Auth service is running" });
});

router.post("/login", login);

export default router;

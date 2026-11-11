import type { Request, Response } from "express";
import { comparePassword } from "../utils/hash"; 
import { signToken } from "../utils/jwt"; 
import { User } from "../models/user.model";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const validPassword = await comparePassword(password, user.password || "");
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


     

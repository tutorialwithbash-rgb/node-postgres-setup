import type { Request, Response } from "express";
import _ from "lodash";
import { signToken } from "../utils/jwt";
import { hashPassword } from "../utils/hash";
import { User, type UserUpdate } from "../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res.status(400).json({ success: false, error: "User already registered." });

    const user = await User.create({
      ..._.pick(req.body, ["name", "email"]),
      password: await hashPassword(req.body.password),
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201)
      .header("x-auth-token", token)
      .json({
        success: true,
        user: { _id: user.id, ..._.pick(user, ["name", "email", "password"]) },
        message: "User created successfully.",
      });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : "Invalid data",
    });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      users: users.map(({ id, ...user }) => ({ _id: id, ...user })),
      message: "Users retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};


export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req?.user?.id ?? "");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.json({
      success: true,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
      message: "User retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  const id =
    (typeof req.params.id === "string" ? req.params.id : undefined) ||
    (typeof req.query.id === "string" ? req.query.id : undefined);
  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "Missing user id parameter" });
  }
  try {
    // Only validate fields that are present (for PATCH, not all required)
    const allowedFields: (keyof UserUpdate)[] = [
      "name",
      "email",
      "password",
      "isActive",
      "role",
    ];
    const data: UserUpdate = {};
    for (const field of allowedFields) {
      if (field in req.body) {
        data[field] = req.body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No valid fields provided for update" });
    }
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    const updatedUser = await User.updateById(id, data);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({
      success: true,
      user: { _id: updatedUser.id, ..._.pick(updatedUser, ["name", "email", "password", "isActive", "role"]) },
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  const id =
    (typeof req.params.id === "string" ? req.params.id : undefined) ||
    (typeof req.query.id === "string" ? req.query.id : undefined);
  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "Missing user id parameter" });
  }
  try {
    const deletedUser = await User.deleteById(id);
    if (!deletedUser)
      return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Server error",
    });
  }
};
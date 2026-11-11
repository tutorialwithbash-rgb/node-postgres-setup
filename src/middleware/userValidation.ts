import type { Request, Response, NextFunction } from "express";
import Joi from "joi";

// PATCH/UPDATE: All fields optional
export const userPatchSchema = Joi.object({
  name: Joi.string().min(5).max(50).optional(),
  email: Joi.string().min(5).max(255).optional().email(),
  password: Joi.string().min(5).max(255).optional(),
  isAdmin: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

export function validateUserPatch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = userPatchSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((d) => d.message).join(", "),
    });
  }
  return next();
}

// CREATE/POST: Required fields for creation
export const userCreateSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
});

export function validateUserCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = userCreateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details.map((d) => d.message).join(", "),
    });
  }
  return next();
}

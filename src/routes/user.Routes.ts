import { Router } from "express";
import {
  getCurrentUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,  
} from "../controllers/user.Controller";
import { auth } from "../middleware/auth";
import { admin } from "../middleware/admin";
import {
  validateUserPatch,
  validateUserCreate,
} from "../middleware/userValidation";

const router = Router();


router.get("/", auth, admin, getUsers);
router.get("/me", auth, getCurrentUser);
router.post("/", validateUserCreate, createUser);
router.patch("/:id", auth, admin, validateUserPatch, updateUser);
router.delete("/:id", auth, admin, deleteUser);

export default router;

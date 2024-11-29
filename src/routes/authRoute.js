import { Router } from "express";
import { createUser, upload } from "../controllers/auth/createUser";
import { deleteUser } from "../controllers/auth/deleteUser";
import { getUserByAuth } from "../controllers/auth/getUserByAuth";
import { getUsers } from "../controllers/auth/getUsers";
import { login } from "../controllers/auth/login";
import { updateUser, uploadUpdate } from "../controllers/auth/updateUser";
import adminOnly from "../middleware/adminOnly";
import { validateMiddleUser } from "../middleware/validateMiddleUser";

const authRoute = new Router();

// login
authRoute.post("/api/login", login);

// create user (register)
authRoute.post("/api/register", upload.single("imageProfile"), createUser);

// get all users
authRoute.get("/api/users", validateMiddleUser, adminOnly, getUsers);

// get user by id (untuk profile user)
authRoute.get("/api/user", validateMiddleUser, getUserByAuth);

// update user
authRoute.put(
  "/api/update/user",
  uploadUpdate.single("imageProfile"),
  validateMiddleUser,
  updateUser
);

// delete user
authRoute.delete(
  "/api/delete/user/:id",
  validateMiddleUser,
  adminOnly,
  deleteUser
);

export default authRoute;

import { Router } from "express";
import { getUsers } from "../controllers/auth/getUsers";
import { createUser, upload } from "../controllers/auth/createUser";
import { validateMiddleUser } from "../middleware/validateMiddleUser";
import { login } from "../controllers/auth/login";
import { getUserById } from "../controllers/auth/getUserById";
import adminOnly from "../middleware/adminOnly";
import { updateUser, uploadUpdate } from "../controllers/auth/updateUser";
import { deleteUser } from "../controllers/auth/deleteUser";

const authRoute = new Router();

// login
authRoute.post("/api/login", login);

// create user (register)
authRoute.post("/api/register", upload.single("imageProfile"), createUser);

// get all users
authRoute.get("/api/users", validateMiddleUser, adminOnly, getUsers);

// get user by id (untuk profile user)
authRoute.get("/api/user", validateMiddleUser, getUserById);

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

import { Router } from "express";
import { getUsers } from "../controllers/auth/getUsers";
import { createUser } from "../controllers/auth/createUser";
import { validateMiddleUser } from "../middleware/validateMiddleUser";
import { login } from "../controllers/auth/login";
import { getUserById } from "../controllers/auth/getUserById";
import adminOnly from "../middleware/adminOnly";
import { updateUser } from "../controllers/auth/updateUser";
import { deleteUser } from "../controllers/auth/deleteUser";

const authRoute = new Router();

// login
authRoute.post("/api/login", login);

// create user (register)
authRoute.post("/api/register", createUser);

// get all users
authRoute.get("/api/users", validateMiddleUser, adminOnly, getUsers);

// get user by id
authRoute.get("/api/user/:id", validateMiddleUser, adminOnly, getUserById);

// update user
authRoute.put("/api/update/user", validateMiddleUser, updateUser);

// delete user
authRoute.delete(
  "/api/delete/user/:id",
  validateMiddleUser,
  adminOnly,
  deleteUser
);

export default authRoute;

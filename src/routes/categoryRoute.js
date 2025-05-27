import { Router } from "express";
import {
  createCategory,
  upload,
} from "../controllers/categories/createCategory.js";
import { deleteCategory } from "../controllers/categories/deteleCategory.js";
import { getCategory } from "../controllers/categories/getCategory.js";
import adminOnly from "../middleware/adminOnly.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { getCategoryById } from "../controllers/categories/getCategoryById.js";

const categoryRoute = new Router();

// route add category
categoryRoute.post(
  "/api/category",
  validateMiddleUser,
  adminOnly,
  upload.single("imageCategory"),
  createCategory
);

// route getall category
categoryRoute.get("/api/categories", validateMiddleUser, getCategory);

// route get category by id
categoryRoute.get(
  "/api/category/:id",
  validateMiddleUser,
  getCategoryById
);

// route delete category
categoryRoute.delete(
  "/api/delete/category/:id",
  validateMiddleUser,
  adminOnly,
  deleteCategory
);

export default categoryRoute;

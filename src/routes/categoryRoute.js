import { Router } from "express";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { category } from "../controllers/categories/createCategory.js";
import { getCategory } from "../controllers/categories/getCategory.js";
import adminOnly from "../middleware/adminOnly.js";
import { deleteCategory } from "../controllers/categories/deteleCategory.js";


// const router = express.Router();
const categoryRoute = new Router();

// route add category
categoryRoute.post("/api/category",validateMiddleUser, adminOnly, category)

// route getall category
categoryRoute.get("/api/category",validateMiddleUser, adminOnly, getCategory)

// route delete category
categoryRoute.delete("/api/category/:id", validateMiddleUser, adminOnly, deleteCategory)

export default categoryRoute;
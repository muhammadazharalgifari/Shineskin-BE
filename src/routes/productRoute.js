import { Router } from "express";
import { addProduct } from "../controllers/product/addProduct.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { getProducts } from "../controllers/product/showProduct.js";
import { deleteProduct } from "../controllers/product/deleteProduct.js";



// const router = express.Router();
const productRoute = new Router();

// route add product
productRoute.post("/api/product/", validateMiddleUser, addProduct)

// route all product
productRoute.get("/api/products/", validateMiddleUser, getProducts)

// route delete product
productRoute.delete("/api/product/:id", validateMiddleUser, deleteProduct)

export default productRoute;
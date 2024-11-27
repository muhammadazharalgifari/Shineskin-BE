import { Router } from "express";
import { addProduct } from "../controllers/product/addProduct.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { getProducts } from "../controllers/product/showProduct.js";



// const router = express.Router();
const productRoute = new Router();

// route add product
productRoute.post("/api/product/", validateMiddleUser, addProduct)

// route all product
productRoute.get("/api/products/", validateMiddleUser, getProducts)


export default productRoute;
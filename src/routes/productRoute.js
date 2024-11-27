import { Router } from "express";
import { addProduct } from "../controllers/product/addProduct.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";



// const router = express.Router();
const productRoute = new Router();

// route add product
productRoute.post("/api/product/", validateMiddleUser, addProduct)


export default productRoute;
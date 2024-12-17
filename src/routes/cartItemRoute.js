import { Router } from "express";
import { createCartItem } from "../controllers/cartItem/createCartItem.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";

const cartItemRoute = new Router();

// route add cart item
cartItemRoute.post("/api/cart-item", validateMiddleUser, createCartItem);


export default cartItemRoute;
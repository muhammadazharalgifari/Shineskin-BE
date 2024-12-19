import { Router } from "express";
import { createCartItem } from "../controllers/cartItem/createCartItem.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { getCartItemByUserId } from "../controllers/cartItem/getCartItemByUserId.js";
import { deleteProductCart } from "../controllers/cartItem/deleteProductCart.js";
import { updateCartItemById } from "../controllers/cartItem/updateCartItem.js";

const cartItemRoute = new Router();

// route add cart item
cartItemRoute.post(
  "/api/cart-item/:productId",
  validateMiddleUser,
  createCartItem
);

// route get all cart items by cart id
cartItemRoute.get(
  "/api/cart-items",
  validateMiddleUser,
  getCartItemByUserId
);

// route delete Product cartItem
cartItemRoute.delete(
  "/api/delete/cartItem/:id",
  validateMiddleUser,
  deleteProductCart
)

// route update Product cartItem
cartItemRoute.put(
  "/api/update/cartItem/:id",
  validateMiddleUser,
  updateCartItemById
)


export default cartItemRoute;
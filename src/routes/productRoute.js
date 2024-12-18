import { Router } from "express";
import { addProduct, upload } from "../controllers/product/addProduct.js";
import { validateMiddleUser } from "../middleware/validateMiddleUser.js";
import { getProducts } from "../controllers/product/getProducts.js";
import { deleteProduct } from "../controllers/product/deleteProduct.js";
import { getProductsByCategory } from "../controllers/product/getProductsByCategory.js";
import {
  updateProduct,
  uploadUpdate,
} from "../controllers/product/updateProduct.js";
import adminOnly from "../middleware/adminOnly.js";
import { getProductById } from "../controllers/product/getProductById.js";

const productRoute = new Router();

// route add product
productRoute.post(
  "/api/create/product/:categoryId",
  validateMiddleUser,
  adminOnly,
  upload.single("imageProduct"),
  addProduct
);

// route all products
productRoute.get("/api/products",
  validateMiddleUser,
  getProducts
);

// route delete product
productRoute.delete(
  "/api/delete/product/:id",
  validateMiddleUser,
  adminOnly,
  deleteProduct
);

// route update product
productRoute.put(
  "/api/update/product/:id",
  validateMiddleUser,
  adminOnly,
  uploadUpdate.single("imageProduct"),
  updateProduct
);

// route GetProductsBy CategoryId
productRoute.get(
  "/api/:category/products",
  validateMiddleUser,
  getProductsByCategory
);

// route GetProductById
productRoute.get(
  "/api/product/:id",
  validateMiddleUser,
  adminOnly,
  getProductById
);

export default productRoute;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _addProduct = require("../controllers/product/addProduct.js");
var _validateMiddleUser = require("../middleware/validateMiddleUser.js");
var _getProducts = require("../controllers/product/getProducts.js");
var _deleteProduct = require("../controllers/product/deleteProduct.js");
var _getProductsByCategory = require("../controllers/product/getProductsByCategory.js");
var _updateProduct = require("../controllers/product/updateProduct.js");
var _adminOnly = _interopRequireDefault(require("../middleware/adminOnly.js"));
var _getProductById = require("../controllers/product/getProductById.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var productRoute = new _express.Router();

// route add product
productRoute.post("/api/create/product/:categoryId", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _addProduct.upload.single("imageProduct"), _addProduct.addProduct);

// route all products
productRoute.get("/api/products", _validateMiddleUser.validateMiddleUser, _getProducts.getProducts);

// route delete product
productRoute["delete"]("/api/delete/product/:id", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _deleteProduct.deleteProduct);

// route update product
productRoute.put("/api/update/product/:id", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _updateProduct.uploadUpdate.single("imageProduct"), _updateProduct.updateProduct);

// route GetProductsBy CategoryId
productRoute.get("/api/:category/products", _validateMiddleUser.validateMiddleUser, _getProductsByCategory.getProductsByCategory);

// route GetProductById
productRoute.get("/api/product/:id", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _getProductById.getProductById);
var _default = exports["default"] = productRoute;
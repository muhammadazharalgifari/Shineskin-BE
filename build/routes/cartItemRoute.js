"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _createCartItem = require("../controllers/cartItem/createCartItem.js");
var _validateMiddleUser = require("../middleware/validateMiddleUser.js");
var _getCartItemByUserId = require("../controllers/cartItem/getCartItemByUserId.js");
var _deleteProductCart = require("../controllers/cartItem/deleteProductCart.js");
var _updateCartItem = require("../controllers/cartItem/updateCartItem.js");
var cartItemRoute = new _express.Router();

// route add cart item
cartItemRoute.post("/api/cart-item/:productId", _validateMiddleUser.validateMiddleUser, _createCartItem.createCartItem);

// route get all cart items by cart id
cartItemRoute.get("/api/cart-items", _validateMiddleUser.validateMiddleUser, _getCartItemByUserId.getCartItemByUserId);

// route delete Product cartItem
cartItemRoute["delete"]("/api/delete/cartItem/:id", _validateMiddleUser.validateMiddleUser, _deleteProductCart.deleteProductCart);

// route update Product cartItem
cartItemRoute.put("/api/update/cartItem/:id", _validateMiddleUser.validateMiddleUser, _updateCartItem.updateCartItemById);
var _default = exports["default"] = cartItemRoute;
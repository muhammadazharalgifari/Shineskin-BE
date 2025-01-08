"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _createCategory = require("../controllers/categories/createCategory.js");
var _deteleCategory = require("../controllers/categories/deteleCategory.js");
var _getCategory = require("../controllers/categories/getCategory.js");
var _adminOnly = _interopRequireDefault(require("../middleware/adminOnly.js"));
var _validateMiddleUser = require("../middleware/validateMiddleUser.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var categoryRoute = new _express.Router();

// route add category
categoryRoute.post("/api/category", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _createCategory.upload.single("imageCategory"), _createCategory.createCategory);

// route getall category
categoryRoute.get("/api/categories", _validateMiddleUser.validateMiddleUser, _getCategory.getCategory);

// route delete category
categoryRoute["delete"]("/api/delete/category/:id", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _deteleCategory.deleteCategory);
var _default = exports["default"] = categoryRoute;
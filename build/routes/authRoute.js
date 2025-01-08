"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _createUser = require("../controllers/auth/createUser");
var _deleteUser = require("../controllers/auth/deleteUser");
var _getUserByAuth = require("../controllers/auth/getUserByAuth");
var _getUsers = require("../controllers/auth/getUsers");
var _login = require("../controllers/auth/login");
var _updateUser = require("../controllers/auth/updateUser");
var _adminOnly = _interopRequireDefault(require("../middleware/adminOnly"));
var _validateMiddleUser = require("../middleware/validateMiddleUser");
var _getUserById = require("../controllers/auth/getUserById");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var authRoute = new _express.Router();

// login
authRoute.post("/api/login", _login.login);

// create user (register)
authRoute.post("/api/register", _createUser.upload.single("imageProfile"), _createUser.createUser);

// get all users
authRoute.get("/api/users", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _getUsers.getUsers);

// get user by auth (untuk profile user)
authRoute.get("/api/user", _validateMiddleUser.validateMiddleUser, _getUserByAuth.getUserByAuth);

// get user by id
authRoute.get("/api/user/:id", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _getUserById.getUserById);

// update user
authRoute.put("/api/update/user", _updateUser.uploadUpdate.single("imageProfile"), _validateMiddleUser.validateMiddleUser, _updateUser.updateUser);

// delete user
authRoute["delete"]("/api/delete/user/:id", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _deleteUser.deleteUser);
var _default = exports["default"] = authRoute;
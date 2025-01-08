"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _getAllTransactions = require("../controllers/transaction/getAllTransactions.js");
var _validateMiddleUser = require("../middleware/validateMiddleUser.js");
var _getTransactionByAuth = require("../controllers/transaction/getTransactionByAuth.js");
var _adminOnly = _interopRequireDefault(require("../middleware/adminOnly.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var transactionRoute = new _express.Router();

// route get all transactions
transactionRoute.get("/api/transactions", _validateMiddleUser.validateMiddleUser, _adminOnly["default"], _getAllTransactions.getAllTransactions);

// route get transactions by Auth
transactionRoute.get("/api/auth-transactions", _validateMiddleUser.validateMiddleUser, _getTransactionByAuth.getTransactionByAuth);
var _default = exports["default"] = transactionRoute;
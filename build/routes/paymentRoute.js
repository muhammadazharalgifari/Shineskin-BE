"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _validateMiddleUser = require("../middleware/validateMiddleUser");
var _payment = require("../controllers/transaction/payment.js");
var paymentRoute = new _express.Router();
paymentRoute.post("/api/payment/process-transaction", _validateMiddleUser.validateMiddleUser, _payment.paymentSnap);
paymentRoute.post("/api/payment/notification", _validateMiddleUser.validateMiddleUser, _payment.paymentNotification);
var _default = exports["default"] = paymentRoute;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _test = require("../controllers/test/test");
var testRoute = new _express.Router();
testRoute.get("/api/test", _test.test);
var _default = exports["default"] = testRoute;
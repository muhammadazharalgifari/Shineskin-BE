"use strict";

var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _path = _interopRequireDefault(require("path"));
var _authRoute = _interopRequireDefault(require("./routes/authRoute"));
var _categoryRoute = _interopRequireDefault(require("./routes/categoryRoute"));
var _productRoute = _interopRequireDefault(require("./routes/productRoute"));
var _cartItemRoute = _interopRequireDefault(require("./routes/cartItemRoute"));
var _transactionRoute = _interopRequireDefault(require("./routes/transactionRoute"));
var _paymentRoute = _interopRequireDefault(require("./routes/paymentRoute"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// configuration
var app = (0, _express["default"])();
_dotenv["default"].config();
var PORT = process.env.PORT;
app.use((0, _cors["default"])());
app.use(_express["default"].json({
  limit: "100mb"
}));
app.use(_express["default"].urlencoded({
  extended: "true"
}));

// route static untuk profile dan product
app.use("/profile", _express["default"]["static"](_path["default"].join(__dirname, "../public/imageProfile")));
// route static untuk product
app.use("/public", _express["default"]["static"](_path["default"].join(__dirname, "../public/imageProducts"))); // Folder untuk menyimpan gambar

// route static untuk product
app.use("/public", _express["default"]["static"](_path["default"].join(__dirname, "../public/imageCategory"))); // Folder untuk menyimpan gambar

// routes
app.use(_authRoute["default"]);
app.use(_productRoute["default"]);
app.use(_categoryRoute["default"]);
app.use(_cartItemRoute["default"]);
app.use(_transactionRoute["default"]);
app.use(_paymentRoute["default"]);
app.listen(PORT, function () {
  console.log("\n    ===========================\n    \n    Server running on port ".concat(PORT, "\n    \n    ===========================\n    "));
});
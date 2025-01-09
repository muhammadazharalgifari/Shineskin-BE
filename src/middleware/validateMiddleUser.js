import { request, response } from "express";
import jwt from "jsonwebtoken";

async function validateMiddleUser(req = request, res = response, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Token",
      });
    }

    // jwt
    const key = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, key);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    // apabila token expired
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        status: "error",
        message: "Token expired",
      });
    }
    // apabila token invalid
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        status: "error",
        message: "Token invalid",
      });
    }
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { validateMiddleUser };

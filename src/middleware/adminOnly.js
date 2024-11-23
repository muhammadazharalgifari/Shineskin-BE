import { request, response } from "express";
import db from "../connector";

const adminOnly = async (req = request, res = response, next) => {
  try {
    const user = await db.users.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User Not Found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Access Denied",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export default adminOnly;

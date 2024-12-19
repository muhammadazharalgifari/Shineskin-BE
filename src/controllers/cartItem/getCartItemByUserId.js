import { request, response } from "express";
import db from "../../connector";

async function getCartItemByUserId(req = request, res = response) {
  try {

    // current user
    const userId = req.userId;

    const response = await db.users.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        id: true,
        cartItem: true
      },
    });

    if (isNaN(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid UserID",
      });
    }

    if (!response) {
      return res.status(404).json({
        status: "error",
        message: `Cart item with User ID ${userId} not found`,
      });
    }

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { getCartItemByUserId };
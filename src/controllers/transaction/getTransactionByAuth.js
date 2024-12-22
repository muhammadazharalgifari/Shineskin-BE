import { request, response } from "express";
import db from "../../connector";

async function getTransactionByAuth(req = request, res = response) {
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

    // ambil data subtotal terbaru
    const totalPrice = await db.transactions.findFirst({
      where: {
        userId: parseInt(userId),
        status: "PENDING",
      },
      select: {
        total_price: true,
      },
    });

    if (!totalPrice) {
      return res.status(404).json({
        status: "error",
        message: `Transaction NOT Found with User ID ${userId} `,
      });
    }

    res.status(200).json({
      status: "success",
      total_price: totalPrice.total_price
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { getTransactionByAuth };
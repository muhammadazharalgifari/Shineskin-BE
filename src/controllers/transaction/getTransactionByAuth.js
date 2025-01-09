import { request, response } from "express";
import db from "../../connector";

async function getTransactionByAuth(req = request, res = response) {
  try {
    // current user
    const userId = req.userId;

    if (isNaN(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid UserID",
      });
    }

    // ambil data subtotal terbaru
    const response = await db.transactions.findFirst({
      where: {
        userId: parseInt(userId),
      },
      select: {
        id: true,
        status: true,
        total_price: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!response) {
      return res.status(404).json({
        status: "error",
        message: `Transaction NOT Found with User ID ${userId} `,
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

export { getTransactionByAuth };

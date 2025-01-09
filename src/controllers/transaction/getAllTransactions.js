import { request, response } from "express";
import db from "../../connector";

async function getAllTransactions(req = request, res = response) {
  try {

    const response = await db.transactions.findMany({
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        user: {
          select: {
            username: true,
            email: true,
          }
        },
        total_price: true,
        status: true,
        imageTransaction: true,
        createdAt: true,
        updatedAt: true,
        cartItems: {
          include: {
            product: true,
          }
        }
      },
    });
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

export { getAllTransactions };

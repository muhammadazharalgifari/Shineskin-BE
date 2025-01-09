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
    const response = await db.transactions.findMany({
      where: {
        userId: parseInt(userId),
      },
      select: {
        id: true,
        status: true,
        total_price: true,
        imageTransaction: true,
        createdAt: true,
        updatedAt: true,
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!response) {
      return res.status(404).json({
        status: "error",
        message: `Transaction NOT Found with User ID ${userId} `,
      });
    }

    // Formatter Transaction
    const formatterTransaction = response.map((item) => {
      return {
        id: item.id,
        status: item.status,
        total_price: item.total_price,
        imageTransaction: item.imageTransaction,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        products: item.cartItems.map((cartItem) => {
          return {
            id: cartItem.product.id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            imageProduct: cartItem.product.imageProduct,
            quantity: cartItem.quantity,
            subtotal_price: cartItem.subtotal_price,
          };
        }),
      };
    }
    );

    res.status(200).json({
      status: "success",
      data: formatterTransaction,
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

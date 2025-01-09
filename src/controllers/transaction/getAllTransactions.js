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

    // Formatter Transaction
    const formatterTransaction = response.map((item) => {
      return {
        id: item.id,
        user: {
          username: item.user.username,
          email: item.user.email,
        },
        total_price: item.total_price,
        status: item.status,
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
    });


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

export { getAllTransactions };

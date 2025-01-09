import { request, response } from "express";
import db from "../../connector";

async function getCartItemByUserId(req = request, res = response) {
  try {
    // current user
    const userId = req.userId;

    const response = await db.transactions.findFirst({
      where: {
        userId: parseInt(userId),
        status: "PENDING",
      },
      select:{
        cartItems: {
          select: {
            id: true,
            quantity: true,
            subtotal_price: true,
            transaction: true,
            product: {
              select: {
                name: true,
                price: true,
                imageProduct: true,
              }
            }
          }
        }
      }
    })
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


    // ambil data total_price terbaru
    const totalPrice = await db.transactions.findFirst({
      where: {
        userId: parseInt(userId),
        status: "PENDING",
      },
      select: {
        id: true,
        total_price: true,
      },
    })

    // Formatter CartItem
    const formatterCartItems = response.cartItems.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
        product_name: item.product.name,
        image_product: item.product.imageProduct,
        subtotal_price: item.subtotal_price,
      };
    });

    res.status(200).json({
      status: "success",
      data: formatterCartItems,
      transaction_id: totalPrice?totalPrice.id:null,
      total_price: totalPrice?totalPrice.total_price:0,
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
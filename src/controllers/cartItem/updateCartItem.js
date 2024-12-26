import { request, response } from "express";
import db from "../../connector";
import { updateTransactionTotal } from "../../service/transactionService";

async function updateCartItemById(req = request, res = response) {
  try {
    // current user
    const userId = req.userId;

    const { id } = req.params;
    const {quantity} = req.body;
    const cartItemId = parseInt(id);

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid cart item ID",
      });
    }

    // Cari cart item berdasarkan ID dan user
    const cartItem = await db.cartItems.findUnique({
      where: { id: cartItemId },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        status: "error",
        message: "Cart item not found",
      });
    }

    // Mengambil harga produk dari relasi
    const productPrice = cartItem.product.price;

    // Menghitung subtotal_price yang baru
    const subtotalPrice = productPrice * quantity;

    const response = await db.cartItems.update({
      where: {
        id: cartItemId,
      },
      data:{
        quantity,
        subtotal_price: subtotalPrice,
        userId,
        updatedAt: new Date(),
      }
    });

    if (!response) {
      return res.status(404).json({
        status: "error",
        message: `Cart item with ID ${id} not found`,
      });
    }

    // update Transaction total_price
    const updateTransaction = await updateTransactionTotal(userId);

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

export { updateCartItemById };
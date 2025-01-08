import { request, response } from "express";
import db from "../../connector";
import { updateTransactionTotal } from "../../service/transactionService";

async function deleteProductCart(req = request, res = response) {
  try {
    // current user
    const userId = req.userId;

    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)){
      return res.status(400).json({
        status: "error",
        message: "Invalid product ID"
      });
    }

    const findCartItem = await db.cartItems.findUnique({
      where: {
        id: parseInt(productId),
      },
    });

    if (!findCartItem) {
      return res.status(404).json({
        status: "error",
        message: `Cart item with ID ${id} not found`,
      });
    };

    const response = await db.cartItems.delete({
      where:{
        id: productId
      }
    });

    // update Transaction total_price
    const updateTransaction = await updateTransactionTotal(userId);

    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
      product: response.productId,
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { deleteProductCart };
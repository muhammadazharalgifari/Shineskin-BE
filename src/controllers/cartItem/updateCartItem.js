import { request, response } from "express";
import db from "../../connector";
import { updateTransactionTotal } from "../../service/transactionService";

async function updateCartItemById(req = request, res = response) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { quantity } = req.body;
    const cartItemId = parseInt(id);

    if (isNaN(cartItemId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid cart item ID",
      });
    }

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

    const unitPrice = cartItem.product.isPromo
      ? cartItem.product.promoPrice
      : cartItem.product.price;

    const subtotalPrice = unitPrice * quantity;

    // Hitung stock baru
    const newStock = cartItem.product.stock + (cartItem.quantity - quantity);

    if (newStock < 0) {
      return res.status(400).json({
        status: "error",
        message: "Product out of stock",
      });
    }

    const response = await db.cartItems.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
        subtotal_price: subtotalPrice,
        userId,
        updatedAt: new Date(),
      },
    });

    if (!response) {
      return res.status(404).json({
        status: "error",
        message: `Cart item with ID ${id} not found`,
      });
    }

    await db.products.update({
      where: {
        id: cartItem.productId,
      },
      data: {
        stock: newStock,
      },
    });

    await updateTransactionTotal(userId);

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
// import { request, response } from "express";
// import db from "../../connector";
// import { updateTransactionTotal } from "../../service/transactionService";

// async function updateCartItemById(req = request, res = response) {
//   try {
//     const userId = req.userId;
//     const { id } = req.params;
//     const { quantity } = req.body;
//     const cartItemId = parseInt(id);

//     if (isNaN(cartItemId)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid cart item ID",
//       });
//     }

//     const cartItem = await db.cartItems.findUnique({
//       where: { id: cartItemId },
//       include: {
//         product: true,
//       },
//     });

//     if (!cartItem) {
//       return res.status(404).json({
//         status: "error",
//         message: "Cart item not found",
//       });
//     }

//     // Promo check based on date
//     const now = new Date();
//     const isPromoActive =
//       cartItem.product.isPromo &&
//       cartItem.product.startPromo &&
//       cartItem.product.endPromo &&
//       new Date(cartItem.product.startPromo) <= now &&
//       now <= new Date(cartItem.product.endPromo);

//     const unitPrice = isPromoActive
//       ? cartItem.product.promoPrice
//       : cartItem.product.price;

//     const subtotalPrice = unitPrice * quantity;

//     // Hitung stock baru
//     const newStock = cartItem.product.stock + (cartItem.quantity - quantity);

//     if (newStock < 0) {
//       return res.status(400).json({
//         status: "error",
//         message: "Product out of stock",
//       });
//     }

//     const updatedCartItem = await db.cartItems.update({
//       where: {
//         id: cartItemId,
//       },
//       data: {
//         quantity,
//         subtotal_price: subtotalPrice,
//         userId,
//         updatedAt: new Date(),
//       },
//     });

//     if (!updatedCartItem) {
//       return res.status(404).json({
//         status: "error",
//         message: `Cart item with ID ${id} not found`,
//       });
//     }

//     await db.products.update({
//       where: {
//         id: cartItem.productId,
//       },
//       data: {
//         stock: newStock,
//       },
//     });

//     await updateTransactionTotal(userId);

//     res.status(200).json({
//       status: "success",
//       data: updatedCartItem,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// }

// export { updateCartItemById };

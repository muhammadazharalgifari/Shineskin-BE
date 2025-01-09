import { request, response } from "express";
import db from "../../connector";
import { updateTransactionTotal } from "../../service/transactionService";

async function createCartItem(req = request, res = response) {
  const { quantity } = req.body;
  const { productId } = req.params;

  // current user
  const userId = req.userId;

  try {
    // Periksa apakah transaction sudah ada untuk user
    let transaction = await db.transactions.findFirst({
      where: {
        userId: parseInt(userId),
        status: "PENDING",
      },
    });

    // Jika transaction belum ada, buat baru
    if (!transaction) {
      transaction = await db.transactions.create({
        data: {
          userId: parseInt(userId),
          total_price: 0, // Initial value 0
          status: "PENDING",
          paymentUrl: null,
          imageTransaction: null,
        },
      });
    }

    // Cari produk berdasarkan ID
    const product = await db.products.findUnique({
      where: {
        id: parseInt(productId),
        stock: {
          gt: 0,
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product does not exist",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: "Product out of stock",
      });
    }

    if (!productId || !quantity) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    // Periksa apakah produk sudah ada dalam keranjang untuk transaksi ini berdasarkan transaksi ID yang status nya masih PENDING
    const existingCartItem = await db.cartItems.findFirst({
      where: {
        transactionId: transaction.id,
        productId: parseInt(productId),
        userId: parseInt(userId),
      },
    });
    if (existingCartItem) {
      return res.status(400).json({
        status: "error",
        message: "Product already exists in the cart",
      });
    }

    const subtotalPrice = product.price * quantity;

    const response = await db.cartItems.create({
      data: {
        transactionId: transaction.id,
        productId: product.id,
        quantity,
        subtotal_price: subtotalPrice,
        userId,
      },
    });

    // update Product stock
    const updateStock = await db.products.update({
      where: {
        id: parseInt(productId),
      },
      data: {
        stock: product.stock - quantity,
      },
    });
    if (!updateStock) {
      return res.status(500).json({
        status: "error",
        message: "Failed to update product stock",
      });
    }

    // update Transaction total_price
    const updateTransaction = await updateTransactionTotal(userId);

    res.status(201).json({
      status: "success",
      message: "Cart item created successfully",
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

export { createCartItem };
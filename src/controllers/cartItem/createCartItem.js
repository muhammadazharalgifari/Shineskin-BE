import { request, response } from "express";
import db from "../../connector";

async function createCartItem(req = request, res = response) {
  // const { productId, quantity } = req.body;
  const { quantity } = req.body;
  const { productId } = req.params;

  // current user
  const userId = req.userId;

  try {

    // Cari produk berdasarkan ID
    const product = await db.products.findUnique({
      where: {
        id: parseInt(productId),
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product does not exist",
      });
    }

    if (!productId || !quantity) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    // Periksa apakah transaction sudah ada untuk user
    let transaction = await db.transactions.findFirst({
      where: {
        userId: parseInt(userId),
        status: "PENDING", // initial Status
      },
    });

    // Jika transaction belum ada, buat baru
    if (!transaction) {
      transaction = await db.transactions.create({
        data: {
          userId: parseInt(userId),
          total_price: 0, // Awal total_price diatur ke 0
          status: "PENDING",
          paymentUrl: null,
        },
      });
    }

    // Periksa apakah produk sudah ada dalam keranjang untuk transaksi ini
    const existingCartItem = await db.cartItems.findFirst({
      where: {
        userId: parseInt(userId),
        productId: parseInt(productId),
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

    // ambil data list id cart item
    const listCartItem = await db.cartItems.findMany({
      where: {
        userId: parseInt(userId),
      },
      select: {
        id: true,
        subtotal_price: true
      },
    });

    // menghitung total price dari list of cart itemID
    const totalPrice = listCartItem.reduce((total, item) => total + parseFloat(item.subtotal_price.toString()), 0);

    // update total price ke db
    const updateTransaction = await db.transactions.update({
      where: {
        id: transaction.id,
      },
      data: {
        total_price: totalPrice,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Cart item created successfully",
      data: response,
      total_price: updateTransaction.total_price,
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
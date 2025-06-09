// import { request, response } from "express";
// import db from "../../connector";
// import { updateTransactionTotal } from "../../service/transactionService";

// async function createCartItem(req = request, res = response) {
//   const { quantity } = req.body;
//   const { productId } = req.params;

//   // current user
//   const userId = req.userId;

//   try {
//     // Periksa apakah transaction sudah ada untuk user
//     let transaction = await db.transactions.findFirst({
//       where: {
//         userId: parseInt(userId),
//         status: "PENDING",
//       },
//     });

//     // Jika transaction belum ada, buat baru
//     if (!transaction) {
//       transaction = await db.transactions.create({
//         data: {
//           userId: parseInt(userId),
//           total_price: 0,
//           status: "PENDING",
//           paymentUrl: null,
//           imageTransaction: null,
//         },
//       });
//     }

//     // Cari produk berdasarkan ID
//     const product = await db.products.findUnique({
//       where: {
//         id: parseInt(productId),
//       },
//     });

//     if (!product || product.stock <= 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "Product does not exist or out of stock",
//       });
//     }

//     if (product.stock < quantity) {
//       return res.status(400).json({
//         status: "error",
//         message: "Product stock is not enough",
//       });
//     }

//     if (!productId || !quantity) {
//       return res.status(400).json({
//         status: "error",
//         message: "Missing required fields",
//       });
//     }

//     // Periksa apakah produk sudah ada dalam keranjang
//     const existingCartItem = await db.cartItems.findFirst({
//       where: {
//         transactionId: transaction.id,
//         productId: parseInt(productId),
//         userId: parseInt(userId),
//       },
//     });

//     if (existingCartItem) {
//       return res.status(400).json({
//         status: "error",
//         message: "Product already exists in the cart",
//       });
//     }

//     // Gunakan harga promo jika produk sedang promo
//     const unitPrice = product.isPromo ? product.promoPrice : product.price;
//     const subtotalPrice = unitPrice * quantity;

//     // Simpan ke cartItems
//     const response = await db.cartItems.create({
//       data: {
//         transactionId: transaction.id,
//         productId: product.id,
//         quantity,
//         subtotal_price: subtotalPrice,
//         userId,
//       },
//     });

//     // Update stock produk
//     const updateStock = await db.products.update({
//       where: {
//         id: parseInt(productId),
//       },
//       data: {
//         stock: product.stock - quantity,
//       },
//     });

//     if (!updateStock) {
//       return res.status(500).json({
//         status: "error",
//         message: "Failed to update product stock",
//       });
//     }

//     // Update total_price transaksi
//     await updateTransactionTotal(userId);

//     res.status(201).json({
//       status: "success",
//       message: "Cart item created successfully",
//       data: response,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// }

// export { createCartItem };
import { request, response } from "express";
import db from "../../connector";
import { updateTransactionTotal } from "../../service/transactionService";
import { utcToZonedTime } from "date-fns-tz";

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
          total_price: 0,
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
      },
    });

    if (!product || product.stock <= 0) {
      return res.status(404).json({
        status: "error",
        message: "Product does not exist or out of stock",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: "Product stock is not enough",
      });
    }

    if (!productId || !quantity) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    // Periksa apakah produk sudah ada dalam keranjang
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

    // Cek promo aktif atau tidak
    const timeZone = "Asia/Jakarta";
    const now = utcToZonedTime(new Date(), timeZone);

    const isPromoActive =
      product.isPromo &&
      product.promoStart &&
      product.promoEnd &&
      new Date(product.promoStart) <= now &&
      new Date(product.promoEnd) >= now;

    // Gunakan harga promo jika promo aktif
    const unitPrice = isPromoActive ? product.promoPrice : product.price;
    const subtotalPrice = unitPrice * quantity;

    // Simpan ke cartItems
    const response = await db.cartItems.create({
      data: {
        transactionId: transaction.id,
        productId: product.id,
        quantity,
        subtotal_price: subtotalPrice,
        userId,
      },
    });

    // Update stock produk
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

    // Update total_price transaksi
    await updateTransactionTotal(userId);

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

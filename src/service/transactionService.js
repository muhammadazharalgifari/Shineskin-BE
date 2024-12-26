// services/transactionService.js
import db from "../connector";

export async function updateTransactionTotal(userId) {
  const cartItems = await db.cartItems.findMany({
    where: { userId },
    select: { subtotal_price: true }
  });

  const totalPrice = cartItems.reduce((sum, item) =>
    sum + parseFloat(item.subtotal_price.toString()), 0);

  // menghitung total price dari list of cart itemID
  // const totalPrice = listCartItems.reduce((total, item) => total + parseFloat(item.subtotal_price.toString()), 0);

  return db.transactions.updateMany({
    where: {
      userId,
      status: "PENDING"
    },
    data: { total_price: totalPrice }
  });
}
// services/transactionService.js
import db from "../connector";

export async function updateTransactionTotal(userId) {

  const pendingTransaction = await db.transactions.findFirst({
    where: {
      userId,
      status: "PENDING"
    },
    select: {
      id: true
    }
  });

  if (!pendingTransaction){
    return resizeBy.status(400).json({
      status: "error",
      message: "Transaction Pending not found"
    })
  }

  const cartItems = await db.cartItems.findMany({
    where: {
      userId,
      transactionId: pendingTransaction.id
    },
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
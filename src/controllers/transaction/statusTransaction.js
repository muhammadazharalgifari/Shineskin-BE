import { request, response } from "express";
import db from "../../connector";

const statusTransaction = async (req = request, res = response) => {
  try {
    const transactionId = parseInt(req.params.id);

    const transaction = await db.transactions.findUnique({
      where: {
        id: transactionId,
        status: "PENDING",
      },
    });

    if (!transaction || transaction.status !== "PENDING") {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found / DONE Status SUCCESS",
      });
    }

    const response = await db.transactions.update({
      where: {
        id: transactionId,
      },
      data: {
        status: "SUCCESS",
      },
    });

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


export { statusTransaction };
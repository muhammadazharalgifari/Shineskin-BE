import { utcToZonedTime } from "date-fns-tz";
import { request, response } from "express";
import db from "../../connector";
import {
  updateDailySalesForDate,
  updateMonthlySalesForDate,
} from "../../controllers/cron/cronController.js";

const statusTransaction = async (req = request, res = response) => {
  try {
    const transactionId = parseInt(req.params.id);

    const transaction = await db.transactions.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!transaction || transaction.status !== "PENDING") {
      return res.status(404).json({
        status: "error",
        message: "Transaction not found or already processed.",
      });
    }

    const updatedTransaction = await db.transactions.update({
      where: { id: transactionId },
      data: { status: "SUCCESS" },
    });

    const createdAtJakarta = utcToZonedTime(
      updatedTransaction.createdAt,
      "Asia/Jakarta"
    );

    // Update daily dan monthly sales
    await updateDailySalesForDate(createdAtJakarta);
    await updateMonthlySalesForDate(createdAtJakarta);

    return res.status(200).json({
      status: "success",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error in statusTransaction:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

export { statusTransaction };

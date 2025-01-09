import { request, response } from "express";
import db from "../../connector";

const getOmsetTransactionDay = async (req = request, res = response) => {
  try {
    const dailyTransactions = await db.$queryRaw`
      SELECT 
        date(createdAt) as transactionDate,
        COUNT(*) as totalTransactions,
        SUM(total_price) as totalAmount,
        COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as successTransactions,
        SUM(CASE WHEN status = 'SUCCESS' THEN total_price ELSE 0 END) as successAmount
      FROM transactions 
      GROUP BY date(createdAt)
      ORDER BY date(createdAt) DESC
    `;

    // Format response data dengan konversi eksplisit dari BigInt
    const formattedData = dailyTransactions.map(day => ({
      date: day.transactionDate,
      totalTransactions: Number(day.totalTransactions),
      totalAmount: Number(day.totalAmount || 0),
      pandingAmount: Number(day.totalAmount || 0) - Number(day.successAmount || 0),
      successTransactions: Number(day.successTransactions),
      successAmount: Number(day.successAmount || 0),
      successRate: Number(day.totalTransactions) > 0
        ? `${((Number(day.successTransactions) / Number(day.totalTransactions)) * 100).toFixed(1)}%`
        : '0.0%'
    }));

    res.status(200).json({
      status: "success",
      data: formattedData
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export { getOmsetTransactionDay };
import { request, response } from "express";
import db from "../../connector";

const getOmsetTransactionMonth = async (req = request, res = response) => {
  try {
    const monthlyTransactions = await db.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as yearMonth,
        COUNT(*) as totalTransactions,
        SUM(total_price) as totalAmount,
        COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as successTransactions,
        SUM(CASE WHEN status = 'SUCCESS' THEN total_price ELSE 0 END) as successAmount
      FROM transactions 
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY yearMonth DESC
    `;

    // Format response data dengan konversi eksplisit dari BigInt
    const formattedData = monthlyTransactions.map(month => ({
      yearMonth: month.yearMonth,
      totalTransactions: Number(month.totalTransactions),
      totalAmount: Number(month.totalAmount || 0),
      pendingAmount: Number(month.totalAmount || 0) - Number(month.successAmount || 0),
      successTransactions: Number(month.successTransactions),
      successAmount: Number(month.successAmount || 0),
      successRate: Number(month.totalTransactions) > 0 
        ? `${((Number(month.successTransactions) / Number(month.totalTransactions)) * 100).toFixed(1)}%`
        : '0.0%',
      averageTransactionSuccess: Number(month.successTransactions) > 0
        ? Number(month.successAmount) / Number(month.successTransactions)
        : 0
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

export { getOmsetTransactionMonth };
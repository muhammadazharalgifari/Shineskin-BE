import { request, response } from "express";
import db from "../../connector";
async function getDailySales(req = request, res = response) {
  try {
    const sales = await db.dailySales.findMany({
      orderBy: {
        date: "asc",
      },
    });

    const formattedSales = sales.map((sale) => ({
      id: sale.id,
      date: sale.date,
      totalSales: sale.totalSales,
    }));

    res.status(200).json({
      status: "success",
      data: formattedSales,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { getDailySales };

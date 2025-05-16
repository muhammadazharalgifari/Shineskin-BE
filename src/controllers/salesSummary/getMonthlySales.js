// import { request, response } from "express";
// import db from "../../connector";

// async function getMonthlySales(req = request, res = response) {
//   try {
//     const sales = await db.monthlySales.findMany({
//       orderBy: {
//         month: "asc",
//       },
//     });

//     const formattedSales = sales.map((sale) => ({
//       id: sale.id,
//       month: sale.month.toISOString().slice(0, 7),
//       totalSales: sale.totalSales,
//     }));

//     res.status(200).json(formattedSales);
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// }

// export { getMonthlySales };
import { request, response } from "express";
import db from "../../connector";
import { utcToZonedTime, format } from "date-fns-tz";

async function getMonthlySales(req = request, res = response) {
  try {
    const sales = await db.monthlySales.findMany({
      orderBy: {
        month: "asc",
      },
    });

    const formattedSales = sales.map((sale) => ({
      id: sale.id,
      month: format(utcToZonedTime(sale.month, "Asia/Jakarta"), "yyyy-MM"),
      totalSales: sale.totalSales,
    }));

    res.status(200).json(formattedSales);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { getMonthlySales };

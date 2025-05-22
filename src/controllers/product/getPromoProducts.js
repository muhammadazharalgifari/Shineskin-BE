import { request, response } from "express";
import { utcToZonedTime } from "date-fns-tz";
import db from "../../connector";

async function getPromoProducts(req = request, res = response) {
  try {
    const timeZone = "Asia/Jakarta";
    const now = utcToZonedTime(new Date(), timeZone);

    const promoProducts = await db.products.findMany({
      where: {
        isPromo: true,
        promoStart: {
          lte: now,
        },
        promoEnd: {
          gte: now,
        },
        stock: {
          gt: 0,
        },
      },
      orderBy: {
        promoStart: "asc",
      },
    });

    res.status(200).json({
      status: "success",
      data: promoProducts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { getPromoProducts };

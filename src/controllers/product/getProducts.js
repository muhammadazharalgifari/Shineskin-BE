import { request, response } from "express";
import { utcToZonedTime } from "date-fns-tz";
import db from "../../connector";

async function getProducts(req = request, res = response) {
  try {
    const timeZone = "Asia/Jakarta";
    const now = utcToZonedTime(new Date(), timeZone);

    const products = await db.products.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        imageProduct: true,
        userId: true,
        categoryId: true,
        isPromo: true,
        promoPrice: true,
        promoStart: true,
        promoEnd: true,
      },
    });

    const response = products.map((product) => {
      const isPromoActive =
        product.isPromo &&
        product.promoStart &&
        product.promoEnd &&
        new Date(product.promoStart) <= now &&
        new Date(product.promoEnd) >= now;

      return {
        ...product,
        promoPrice: isPromoActive ? product.promoPrice : null,
        promoStart: isPromoActive ? product.promoStart : null,
        promoEnd: isPromoActive ? product.promoEnd : null,
      };
    });

    res.status(200).json({
      status: "success",
      products: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { getProducts };

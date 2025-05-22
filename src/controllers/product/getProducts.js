import { request, response } from "express";
import db from "../../connector";

async function getProducts(req = request, res = response) {
  try {
    const response = await db.products.findMany({
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

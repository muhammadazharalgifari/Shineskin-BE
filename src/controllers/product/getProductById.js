import { request, response } from "express";
import db from "../../connector";

async function getProductById(req = request, res = response) {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    // validasi data param categoryId harus int
    if (isNaN(productId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Product ID",
      });
    }

    const response = await db.products.findMany({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        imageProduct: true,
        stock: true,
      },
    });
    // Jika Product tidak ditemukan
    if (!response) {
      return res.status(404).json({
        status: "error",
        message: `Product with ID ${id} not found`,
      });
    }
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

export { getProductById };

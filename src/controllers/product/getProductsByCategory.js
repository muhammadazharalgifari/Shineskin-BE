import { request, response } from "express";
import db from "../../connector";


async function getProductsByCategory(req = request, res = response) {
  try {
    const { category } = req.params;
    const categoryId =  parseInt(category);

    // validasi data param categoryId harus int
    if (isNaN(categoryId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid category ID",
      });
    }

    const response = await db.categories.findMany({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
        products: true,
      },
    });
  // Cek Jika CategoryId tidak ada
  if (response.length === 0) {
    return res.status(404).json({
      status: "error",
      message: "No Found Name Category"
    });
  }

  // Dapatkan data response, lalu cek products
  const categoryData = response[0];
  if (categoryData.products.length === 0) {
    return res.status(404).json({
      status: `Founded category ${categoryData.name}`,
      message: "No products found for this category"
    });
  }

    res.status(200).json({
      status: "success",
      message: "Get ProductByCategory successfully",
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


export { getProductsByCategory }
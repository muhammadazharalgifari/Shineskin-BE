import { request, response } from "express";
import db from "../../connector";

async function deleteProduct(req = request, res = response) {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)){
      return res.status(400).json({
        status: "error",
        message: "Invalid product ID"
      });
    }

    const findProduct = await db.products.findUnique({
      where: {
        id: productId,
      }
    });

    if (!findProduct) {
      return res.status(404).json({
        status: "error",
        message: `Product with ID ${id} not found`,
      });
    }

    const response = await db.products.delete({
      where: {
        id: productId,
      }
    });
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      product: response.name,
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { deleteProduct }
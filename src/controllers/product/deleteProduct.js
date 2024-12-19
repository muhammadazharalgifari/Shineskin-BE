import { request, response } from "express";
import db from "../../connector";
import path from "path";
import fs from "fs";

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
      },
      select: {
        imageProduct: true,
      },
    });

    if (!findProduct) {
      return res.status(404).json({
        status: "error",
        message: `Product with ID ${id} not found`,
      });
    }

    // Tentukan path gambar berdasarkan path di database
    const imagePath = path.join(__dirname, "../../../public/imageProducts"); // Ganti dengan path yang sesuai
    var filepath = imagePath + "/" + findProduct.imageProduct;

    // Hapus local file
    fs.unlink(filepath, (err) => {
      if (err) {
        console.error("Failed to delete image:", err);
      } else {
        console.log("Image deleted successfully");
      }
    });


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
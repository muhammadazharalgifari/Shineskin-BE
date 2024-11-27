import { request, response } from "express";
import db from "../../connector";
import { getCategory } from "../categories/getCategory";
import path from "path";
import fs from "fs";

const updateProduct = async (req = request, res = response) => {

  try {
  // Ambil ID dari parameter URL
  const { id: productId } = req.params;

  // Validasi ID
  if (!productId) {
    return res.status(400).json({
      status: "error",
      message: "Product ID is required.",
    });
  }
  const product = await db.products.findUnique({
    where: {
      id: parseInt(productId),
    },
  });

  if (!product){
    return res.status(404).json({
      status: "error",
      message: "Product Not Found / Not Selected",
    });
  }

    const {name, description, price, stock, imageProduct, categoryId } = req.body;

    if (name === "" || name === null) {
      return res.status(400).json({ message: "Name cannot be empty "});
    }

    // get categoriId optional var
    const categoriProduct = categoryId


    // Validate image type
    const mimeType = imageProduct.match(/data:(image\/\w+);base64,/);
    if (!mimeType) {
      return res.status(400).json({ message: "Invalid image type" });
    }

    // Extract extension
    const mime = mimeType[1];
    const extension = mime.split("/")[1];

    // Remove prefix from base64 string
    const base64Image = imageProduct.replace(/^data:image\/\w+;base64,/, "");

    // Generate a unique filename
    const fileName = `${Date.now()}-${name}.${extension}`;

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Image, "base64");

    // Save image to the specified folder
    const imagePath = path.join(__dirname, "../../../public/imageProducts", fileName);
    fs.writeFileSync(imagePath, buffer);

    const response = await db.products.update({
      where: {
        id: parseInt(productId)
      },
      data: {
        name,
        description,
        price,
        stock,
        imageProduct: product.imageProduct,
        categoryId: categoriProduct,
      },
      include: {
        category: getCategory
      }
    });
    res.status(201).json({
      status: "success",
      message: "Product added successfully",
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



export { updateProduct }
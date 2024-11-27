
import { request, response } from "express";
import db from "../../connector";
import path from "path";
import fs from "fs";
import { getCategory } from "../categories/getCategory";


async function addProduct(req = request, res = response) {
  const { name, description, price, stock, imageProduct, categoryId} = req.body;

  // current user
  const userId = req.userId
  const findUser = await db.users.findUnique({
    where: {
      id: userId,
    }
  });
  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "User ID is required",
    });
  }

  // get categoriId optional var
  const categoriProduct = categoryId


  // Validate image type
  const mimeType = imageProduct.match(/data:(image\/\w+);base64,/);
  if (!mimeType) {
    return res.status(400).json({ message: "Invalid image type" });
  }

  try {
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



    const response = await db.products.create({
      data: {
        name,
        description,
        price,
        stock,
        imageProduct: fileName,
        userId: findUser.id,
        categoryId: categoriProduct
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




export { addProduct };
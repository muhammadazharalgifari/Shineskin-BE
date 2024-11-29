import { request, response } from "express";
import db from "../../connector";
import path from "path";
import fs from "fs";
import multer from "multer";

// konfigurasi tempat penyimpanan gambar
const uploadDir = path.join(__dirname, "../../../public/imageProducts");

// konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const newNameProduct = req.body.name;
    const randomDataProduct = newNameProduct.replace(/[^a-zA-Z0-9]/g, "_");

    cb(null, randomDataProduct + path.extname(file.originalname));
  },
});

// validasi type image
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image type"), false);
  }
};

// konfigurasi multer untuk upload image product
const uploadUpdate = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const updateProduct = async (req = request, res = response) => {
  try {
    const productId = parseInt(req.params.id);
    const userId = req.userId;
    const { name, description, price, stock } = req.body;

    const product = await db.products.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    let updateImageProduct = product.imageProduct;
    if (req.file) {
      // hapus foto lama
      const imagePath = path.resolve(
        __dirname,
        "../../../public/imageProducts",
        product.imageProduct
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      // upload foto baru
      updateImageProduct = req.file.filename;
    }

    const response = await db.products.update({
      where: {
        id: productId,
      },
      data: {
        name: name || product.name,
        description: description || product.description,
        price: price ? parseInt(price) : product.price,
        stock: stock ? parseInt(stock) : product.stock,
        imageProduct: updateImageProduct,
        userId,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      updateProduct: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { updateProduct, uploadUpdate };

import { request, response } from "express";
import multer from "multer";
import path from "path";
import db from "../../connector";

// konfigurasi tempat penyimpanan gambar
const uploadDir = path.resolve(__dirname, "../../../public/imageProducts");

// konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const nameProduct = req.body.name;
    const randomDataProduct = nameProduct.replace(/[^a-zA-Z0-9]/g, "_");

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
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

async function addProduct(req = request, res = response) {
  const { name, description, price, stock } = req.body;
  const { categoryId } = req.params;
  // current user
  const userId = req.userId;

  // Create a new product
  try {
    const category = await db.categories.findUnique({
      where: {
        id: parseInt(categoryId),
      },
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category does not exist",
      });
    }

    const response = await db.products.create({
      data: {
        name,
        description,
        price: parseInt(price),
        stock: parseInt(stock),
        imageProduct: req.file.filename,
        userId,
        categoryId: category.id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      product: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { addProduct, upload };
